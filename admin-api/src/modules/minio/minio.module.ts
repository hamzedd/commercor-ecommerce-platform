import { Module } from '@nestjs/common';
import * as Minio from 'minio';
import { MINIO_TOKEN } from '@/src/libs/decorators/minio.decorator';
import {
  MINIO_ACCESS_KEY,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
} from '@/src/utils/environmentConstants';

@Module({
  exports: [MINIO_TOKEN],
  providers: [
    {
      provide: MINIO_TOKEN,
      useFactory: async (): Promise<Minio.Client> => {
        return new Minio.Client({
          endPoint: MINIO_ENDPOINT,
          port: +MINIO_PORT,
          accessKey: MINIO_ACCESS_KEY,
          secretKey: MINIO_SECRET_KEY,
          useSSL: MINIO_USE_SSL,
        });
      },
    },
  ],
})
export class MinioModule {}
