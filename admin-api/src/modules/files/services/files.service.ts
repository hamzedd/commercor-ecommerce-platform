import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import { InjectMinio } from '@/src/libs/decorators/minio.decorator';
import {
  CommercorMinioBucketEnums,
  DEFAULT_MINIO_BUCKET,
} from '@/src/utils/enums/CommercorMinioBucketEnums';
import { GetFileDto } from '@/src/libs/models/dtos/files/GetFile.dto';
import { Stream } from 'node:stream';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);

  constructor(@InjectMinio() private readonly minioService: Minio.Client) {}

  async onModuleInit() {
    await this.ensureBuckets(
      Object.values(CommercorMinioBucketEnums) as readonly string[],
    );
  }

  async bucketsList() {
    return this.minioService.listBuckets();
  }

  async getFile({
    name,
    bucketName = DEFAULT_MINIO_BUCKET,
  }: GetFileDto): Promise<Stream> {
    if (!(Object.values(CommercorMinioBucketEnums) as string[]).includes(bucketName))
      throw new BadRequestException('Invalid file bucket');
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/.test(name) || name.includes('..'))
      throw new BadRequestException('Invalid file name');
    return this.minioService.getObject(bucketName, name);
  }

  uploadFile({
    file,
    bucketName = DEFAULT_MINIO_BUCKET,
  }: {
    file: Express.Multer.File;
    bucketName?: CommercorMinioBucketEnums;
  }): Promise<{ objectName: string }> {
    const maxBytes = Number.parseInt(process.env.UPLOAD_MAX_BYTES || '5242880', 10);
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!file || !allowed.has(file.mimetype))
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
    if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0 || file.size > maxBytes)
      throw new BadRequestException('Uploaded file is too large');
    return new Promise((resolve, reject) => {
      const extensions: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      };
      const filename = `${randomUUID()}.${extensions[file.mimetype]}`;
      this.minioService.putObject(
        bucketName,
        filename,
        file.buffer,
        file.size,
        (error) => {
          if (error) reject(error);
          else resolve({ objectName: filename });
        },
      );
    });
  }

  async uploadFiles({
    files,
    bucketName = DEFAULT_MINIO_BUCKET,
  }: {
    files: Express.Multer.File[];
    bucketName?: CommercorMinioBucketEnums;
  }) {
    const uploaded: Array<{ objectName: string }> = [];

    try {
      for (const file of files) {
        const res = await this.uploadFile({ file, bucketName }); // must include objectName
        uploaded.push(res);
      }

      return uploaded;
    } catch (err) {
      await Promise.allSettled(
        uploaded.map(({ objectName }) =>
          this.minioService.removeObject(bucketName, objectName),
        ),
      );

      throw err;
    }
  }

  async deleteFile({
    fileName,
    bucketName = DEFAULT_MINIO_BUCKET,
  }: {
    fileName: string;
    bucketName?: CommercorMinioBucketEnums;
  }) {
    return this.minioService.removeObject(bucketName, fileName);
  }

  async deleteFiles({
    fileNames,
    bucketName = DEFAULT_MINIO_BUCKET,
  }: {
    fileNames: string[];
    bucketName?: CommercorMinioBucketEnums;
  }) {
    return this.minioService.removeObjects(bucketName, fileNames);
  }

  private async ensureBuckets(buckets: readonly string[]) {
    for (const bucket of buckets) {
      try {
        const exists = await this.bucketExists(bucket);
        if (!exists) {
          await this.makeBucket(bucket);
          this.logger.log(`Created MinIO bucket: ${bucket}`);
        }
      } catch (err: any) {
        if (this.isAlreadyExistsError(err)) {
          this.logger.debug(`MinIO bucket already exists: ${bucket}`);
          continue;
        }
        this.logger.error(
          `Failed to ensure bucket "${bucket}": ${err?.message ?? err}`,
        );
        throw err;
      }
    }
  }

  private bucketExists(bucket: string): Promise<boolean> {
    return this.minioService.bucketExists(bucket);
  }

  private makeBucket(bucket: string): Promise<void> {
    return this.minioService.makeBucket(bucket);
  }

  private isAlreadyExistsError(err: any) {
    const code = err?.code || err?.name;
    return code === 'BucketAlreadyExists' || code === 'BucketAlreadyOwnedByYou';
  }
}
