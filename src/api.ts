import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import { ManifestAsset, vastApi } from './vast/vastApi';
import getConfiguration from './config/config';
import { RedisClient } from './redis/redisclient';
import logger from './util/logger';
import { EncoreClient } from './encore/encoreclient';
import { MinioClient } from './minio/minio';


const HelloWorld = Type.String({
  description: 'The magical words!'
});

export interface HealthcheckOptions {
  title: string;
}

const healthcheck: FastifyPluginCallback<HealthcheckOptions> = (fastify, opts, next) => {
  fastify.get<{ Reply: Static<typeof HelloWorld> }>(
    '/',
    {
      schema: {
        description: 'Say hello',
        response: {
          200: HelloWorld
        }
      }
    },
    async (_, reply) => {
      reply.send('Hello, world! I am ' + opts.title);
    }
  );
  next();
};

export interface ApiOptions {
  title: string;
}

export default (opts: ApiOptions) => {
  logger.info("starting server")
  const config = getConfiguration();
  const redisclient = new RedisClient(config.redisUrl);

  redisclient.connect();

  const saveToRedis = (key: string, value: string) => { redisclient.set(key, value) };

  const encoreClient = new EncoreClient(config.encoreUrl, config.callbackListenerUrl);

  const minioClient = new MinioClient(config.minioUrl, config.minioAccessKey, config.minioSecretKey);

  const api = fastify({
    ignoreTrailingSlash: true
  }).withTypeProvider<TypeBoxTypeProvider>();

  // register the cors plugin, configure it for better security
  api.register(cors);

  // register the swagger plugins, it will automagically do magic
  api.register(swagger, {
    swagger: {
      info: {
        title: opts.title,
        description: 'hello',
        version: 'v1'
      }
    }
  });
  api.register(swaggerUI, {
    routePrefix: '/docs'
  });


  api.register(healthcheck, { title: opts.title });
  // register other API routes here

  api.register(vastApi, {
    adServerUrl: config.adServerUrl,
    lookUpAsset: (mediaFile: string) => redisclient.get(mediaFile),
    onMissingAsset: async (asset: ManifestAsset) => encoreClient.createEncoreJob(asset),
    setupNotification: (asset: ManifestAsset) => minioClient.listenForNotifications("bucket", asset.creativeId, "index.m3u8", () => saveToRedis(asset.creativeId, asset.masterPlaylistUrl))
  });
  return api;
}
