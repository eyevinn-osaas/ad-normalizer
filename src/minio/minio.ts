import * as Minio from 'minio';
import logger from '../util/logger';

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
    onNotification: (r: any) => void
  ) => {
    logger.info('Listening for notifications', {
      bucketName,
      assetId,
      masterPlaylistName
    });
    const poller = this.minioclient?.listenBucketNotification(
      bucketName,
      assetId,
      masterPlaylistName,
      ['s3:ObjectCreated:*']
    );
    poller?.on('notification', (record) => {
      onNotification(record);
      poller.stop();
    });
  };
}
