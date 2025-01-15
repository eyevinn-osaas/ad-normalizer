import { FastifyPluginCallback } from 'fastify';
import bearerAuthPlugin from '@fastify/bearer-auth';
import { ApiKey } from '@osaas/token';
import { ErrorResponse, ErrorReply, errorReply } from './api/errors';
import { InvalidInputError, NotFoundError } from './utils/error';
import { ExampleResource, ExampleResourceId } from './model';

export interface ApiMicroserviceOpts {
  dummy: string;
}

const apiMicroservice: FastifyPluginCallback<ApiMicroserviceOpts> = (fastify, opts, next) => {
  fastify.register(bearerAuthPlugin, {
    keys: ApiKey.getApiKey()
  });

  fastify.setErrorHandler((error, request, reply) => {
    reply.code(500).send({ reason: error.message });
  });

  // Insert routes here...

  fastify.get<{
    Params: { resourceId: ExampleResourceId };
    Reply: ExampleResource | ErrorResponse;
  }>(
    '/resource/:resourceId',
    {
      schema: {
        description: 'Get resource by id',
        response: {
          200: ExampleResource,
          400: ErrorResponse,
          404: ErrorResponse,
          500: ErrorResponse
        },
        security: [{ apiKey: [] }]
      }
    },
    async (request, reply) => {
      try {
        const example = { id: 'foobar' };
        reply.code(200).send(example);
      } catch (err) {
        errorReply(reply as ErrorReply, err);
      }
    }
  );

  next();
};

export default apiMicroservice;

