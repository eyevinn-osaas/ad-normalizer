import { EncoreJob } from "./types"

export const createEncoreJob = (url: string, job: EncoreJob) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(job)
    });
}