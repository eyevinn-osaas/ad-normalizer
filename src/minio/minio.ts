import * as Minio from 'minio';
import logger from '../util/logger';

export interface MinioNotification {
  s3: {
    bucket: {
      name: string;
    };
    object: {
      key: string;
    };
  };
}

export class MinioClient {
  private minioclient: Minio.Client | undefined;
  constructor(
    private url: string,
    private accessKey: string,
    private secretKey: string
  ) {}

  setupClient() {
    logger.info('Setting up Minio Client', { url: this.url });
    if (this.minioclient) {
      logger.error('Minio client already connected');
      return;
    }
    this.minioclient = new Minio.Client({
      endPoint: this.url,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      useSSL: true
    });
  }
  listenForNotifications = (
    bucketName: string,
    assetId: string,
    masterPlaylistName: string,
    onNotification: (r: any) => Promise<void>
  ) => {
    logger.info('Listening for notifications', {
      bucketName,
      assetId,
      masterPlaylistName
    });
    if (this.minioclient == undefined) {
      logger.error('Minio client not connected');
    } else {
      logger.info('Minio client connected');
    }
    const poller = this.minioclient?.listenBucketNotification(
      bucketName,
      assetId,
      masterPlaylistName,
      ['s3:ObjectCreated:*']
    );
    if (poller == undefined) {
      logger.error('Failed to create poller');
    } else {
      logger.info('Poller created');
    }
    poller?.on('notification', (record) => {
      logger.info('Received notification', record);
      onNotification(record as MinioNotification);
      poller.stop();
    });
  };
}
