
export interface AdNormalizerConfiguration {
    encoreUrl: string;
    callbackListenerUrl: string;
    minioUrl: string;
    minioAccessKey: string;
    minioSecretKey: string;
    adServerUrl: string;
    redisUrl: string;
}

let config: AdNormalizerConfiguration | null = null;

let loadConfiguration = (): AdNormalizerConfiguration => {
    const encoreUrl = process.env.ENCORE_URL;
    const callbackListenerUrl = process.env.CALLBACK_LISTENER_URL;
    const minioUrl = process.env.MINIO_URL;
    const minioAccessKey = process.env.MINIO_ACCESS_KEY;
    const minioSecretKey = process.env.MINIO_SECRET_KEY;
    const adServerUrl = process.env.AD_SERVER_URL;
    const redisUrl = process.env.REDIS_URL;
    const configuration = {
        encoreUrl: encoreUrl,
        callbackListenerUrl: callbackListenerUrl,
        minioUrl: minioUrl,
        minioAccessKey: minioAccessKey,
        minioSecretKey: minioSecretKey,
        adServerUrl: adServerUrl,
        redisUrl: redisUrl
    } as AdNormalizerConfiguration;

    return configuration;
}

/**
 * Gets the application config. Configuration is treated as a singleton.
 * If the configuration has not been loaded yet, it will be loaded from environment variables. 
 * @returns configuration object
 */
export default function getConfiguration(): AdNormalizerConfiguration {
    if (config === null) {
        config = loadConfiguration();
    }
    return config as AdNormalizerConfiguration;
}