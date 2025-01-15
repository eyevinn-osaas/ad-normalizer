import { exit } from 'process';
import {
  Instances,
  JwtToken,
  ApiInstanceFactory,
  ExtraContainerType
} from '@osaas/orchestrator';
import { 
  instanceParamsToAnnotationsFunction,
  instanceParamsToEnvVarFunction,
  NewTInstance,
  podDataToInstanceFunction,
  TInstance,
  TInstanceArray,
  TInstanceName 
} from './service';

async function main() {
  let osaasEnvironment = 'stage';
  if (process.env.ENVIRONMENT === 'prod') {
    osaasEnvironment = 'prod';
  }

  if (!process.env.KUBECONFIG_FILE) {
    console.error(`Environment variable 'KUBECONFIG_FILE' must be set!`);
    return exit(1);
  }

  const containerService = new Instances.InstanceServiceProvider<
    TInstanceName,
    NewTInstance,
    TInstance
  >(
    'servicetemplate',
    'eyevinntechnology/servicetemplate:v0.1.0',
    process.env.KUBECONFIG_FILE,
    'servicetemplate',
    podDataToInstanceFunction,
    instanceParamsToAnnotationsFunction,
    instanceParamsToEnvVarFunction,
    {
      environment: osaasEnvironment,
      customerNodeAffinity: process.env.CUSTOMER_NODE_AFFINITY
        ? isTrue(process.env.CUSTOMER_NODE_AFFINITY)
        : false
    }
  );
  await containerService.initService();

  let slackWebHookUrl;
  if (process.env.SLACK_WEBHOOK_URL) {
    slackWebHookUrl = new URL(process.env.SLACK_WEBHOOK_URL);
  }
  const api = ApiInstanceFactory<
    TInstanceName,
    NewTInstance,
    TInstance
  >(
    'servicetemplate',
    containerService,
    TInstanceName,
    NewTInstance,
    TInstance,
    TInstanceArray,
    {
      slackWebHookUrl: slackWebHookUrl,
      enableTrialToken: osaasEnvironment !== 'prod',
      environment: osaasEnvironment,
      provideCookie: true,
      cookieId: 'servicetemplate'
    }
  );

  const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

  api.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`Server listening on ${address}`);
  });
}

export default main();