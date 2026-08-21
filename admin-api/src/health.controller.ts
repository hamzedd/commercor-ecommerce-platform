import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as Minio from 'minio';
import { InjectMinio } from '@/src/libs/decorators/minio.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly db: DataSource,
    @InjectMinio() private readonly minio: Minio.Client,
  ) {}

  @Get()
  live() {
    return {
      service: 'admin-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  liveness() {
    return this.live();
  }

  @Get('ready')
  async readiness() {
    try {
      await this.db.query('SELECT 1');
      await this.minio.listBuckets();
    } catch {
      throw new ServiceUnavailableException(
        'A required infrastructure dependency is unavailable',
      );
    }
    return {
      service: 'admin-api',
      status: 'ready',
      database: 'ok',
      objectStorage: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
