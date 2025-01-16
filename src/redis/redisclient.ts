import { createClient } from 'redis';
import logger from '../util/logger';

export class RedisClient {
    private client: Awaited<ReturnType<typeof createClient>> | null = null;
    constructor(private url: string) { }

    async connect() {
        logger.info('Connecting to Redis', { url: this.url });
        if (this.client) {
            logger.error('Redis client already connected');
            return;
        }
        this.client = await createClient({ url: this.url })
            .on('error', (err) => logger.error('Redis error', { error: err }))
            .connect();
    }

    async disconnect() {
        await this.client?.disconnect();
        this.client = null;
    }

    async get(key: string): Promise<string | null | undefined> {
        await this.connect();
        if (this?.client == null) {
            logger.error('Redis client not connected');
        }
        logger.info('Getting key', { key });
        return this.client?.get(key)
    }

    async set(key: string, value: string): Promise<void> {
        await this.connect();
        this.client?.set(key, value);
    }
}