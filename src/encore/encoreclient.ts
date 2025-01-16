import logger from "../util/logger"
import { ManifestAsset } from "../vast/vastApi";
import { EncoreJob, InputType } from "./types"

export class EncoreClient {
    constructor(private url: string, private callbackUrl: string) { }

    async submitJob(job: EncoreJob): Promise<Response> {
        logger.info('Submitting job to Encore', { job });
        return fetch(`${this.url}/encoreJobs`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/hal+json"
            },
            body: JSON.stringify(job),
        })
    }

    async createEncoreJob(creative: ManifestAsset): Promise<Response> {
        const job: EncoreJob = {
            externalId: creative.creativeId,
            profile: 'program',
            outputFolder: creative.creativeId,
            baseName: creative.creativeId,
            progressCallbackUri: this.callbackUrl,
            inputs: [{
                uri: creative.masterPlaylistUrl,
                seekTo: 0,
                copyTs: true,
                type: InputType.AUDIO_VIDEO
            }]
        }
        return this.submitJob(job);
    }
}


