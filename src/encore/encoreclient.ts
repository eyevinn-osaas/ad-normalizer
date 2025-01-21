import logger from '../util/logger';
import { ManifestAsset } from '../vast/vastApi';
import { EncoreJob, InputType } from './types';
import { Context } from '@osaas/client-core';

export class EncoreClient {
  constructor(
    private url: string,
    private callbackUrl: string,
    private oscToken?: string
  ) {}

  async submitJob(
    job: EncoreJob,
    serviceAccessToken?: string
  ): Promise<Response> {
    logger.info('Submitting job to Encore', { job });
    let headersWithToken = undefined;
    const contentHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/hal+json'
    };
    const jwtHeader: { 'x-jwt': string } | Record<string, never> =
      serviceAccessToken ? { 'x-jwt': `Bearer ${serviceAccessToken}` } : {};
    return fetch(`${this.url}/encoreJobs`, {
      method: 'POST',
      headers: { ...contentHeaders, ...jwtHeader },
      body: JSON.stringify(job)
    });
  }

  async createEncoreJob(creative: ManifestAsset): Promise<Response> {
    let sat;
    if (this.oscToken) {
      const ctx = new Context({
        personalAccessToken: this.oscToken
      });
      sat = await ctx.getServiceAccessToken('encore');
    }
    logger.info(sat);
    const job: EncoreJob = {
      externalId: creative.creativeId,
      profile: 'program',
      outputFolder: '/usercontent/',
      baseName: creative.creativeId,
      progressCallbackUri: this.callbackUrl,
      inputs: [
        {
          uri: creative.masterPlaylistUrl,
          seekTo: 0,
          copyTs: true,
          type: InputType.AUDIO_VIDEO
        }
      ]
    };
    return this.submitJob(job, sat);
  }
}
