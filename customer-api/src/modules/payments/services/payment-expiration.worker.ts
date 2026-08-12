import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PaymentExpirationService } from './payment-expiration.service';

@Injectable()
export class PaymentExpirationWorker
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(PaymentExpirationWorker.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(private readonly expiration: PaymentExpirationService) {}

  onApplicationBootstrap() {
    this.timer = setInterval(() => void this.runOnce(), 60_000);
    this.timer.unref();
  }

  onApplicationShutdown() {
    if (this.timer) clearInterval(this.timer);
  }

  async runOnce() {
    if (this.running) return;
    this.running = true;
    try {
      await this.expiration.expirePendingPayments();
    } catch (error) {
      this.logger.error('Pending payment expiration failed', error);
    } finally {
      this.running = false;
    }
  }
}
