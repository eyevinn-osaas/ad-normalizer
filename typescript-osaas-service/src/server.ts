import { Configure, Log } from '@osaas/logging';
import { exit } from 'process';
import api from './api';

export function isTrue(s: string) {
  const regex = /^\s*(true|1)\s*$/i;
  return regex.test(s);
}

async function main() {
  Configure({ component: 'osaas-micro-service' });
  if (!process.env.KUBECONFIG_FILE) {
    Log().error(`Environment variable 'KUBECONFIG_FILE' must be set!`);
    return exit(1);
  }

  const apiMicroserviceOpts = { dummy: 'string' };
  const server = api({ title: 'OSaaS Micro service', apiMicroserviceOpts });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

  server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      throw err;
    }
    Log().info(`Server listening on ${address}`);
  });
}

export default main();

