import * as Minio from 'minio'
import { AdNormalizerConfiguration } from '../config/config';
import { ResultCallback } from 'minio/dist/main/internal/type';
let minioClient: Minio.Client | null = null;

export const getMinioClient = (config: AdNormalizerConfiguration): Minio.Client => {
    if (minioClient === null) {
        minioClient = new Minio.Client({
            endPoint: config.minioUrl,
            accessKey: config.minioAccessKey,
            secretKey: config.minioSecretKey,
            useSSL: true
        });
    }
    return minioClient;
}

export const listenForNotifications = (minioClient: Minio.Client, bucketName: string, assetId: string, onNotification: (r: any) => void) => {
    const poller = minioClient!.listenBucketNotification(bucketName, assetId, '', ['s3:ObjectCreated:*']);
    poller.on('notification', (record) => {
        onNotification(record)
        poller.stop();
    });
}