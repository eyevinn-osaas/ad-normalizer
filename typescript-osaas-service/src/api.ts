import apiMicroservice, { ApiMicroserviceOpts } from './api_microservice';
import { create } from './api/setup';

export interface ApiOptions {
  title: string;
  apiMicroserviceOpts: ApiMicroserviceOpts;
}

export default (opts: ApiOptions) => {
  const api = create({
    title: opts.title,
    description: 'OSaaS Microservice'
  });
  api.register(apiMicroservice, opts.apiMicroserviceOpts);

  return api;
};
