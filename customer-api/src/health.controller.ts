import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  EMAIL_PROVIDER,
  PAYMENT_PROVIDER,
  PAYPAL_ENV,
} from '@/src/utils/environmentConstants';

@Controller('health')
export class HealthController {
  constructor(private readonly db: DataSource) {}

  @Get()
  live() {
    return {
      service: 'customer-api',
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
    } catch {
      throw new ServiceUnavailableException('Database is unavailable');
    }
    return {
      service: 'customer-api',
      status: 'ready',
      database: 'ok',
      integrations: {
        paymentProvider: PAYMENT_PROVIDER,
        paymentEnvironment:
          PAYMENT_PROVIDER === 'paypal' ? PAYPAL_ENV : 'disabled',
        emailProvider: EMAIL_PROVIDER,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
