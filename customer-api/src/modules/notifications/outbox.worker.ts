import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  NotificationOutboxEntity,
  OutboxStatus,
} from '@/src/libs/models/entities/notification/NotificationOutbox.entity';
import {
  EMAIL_MAX_ATTEMPTS,
  EMAIL_PROVIDER,
  SMTP_PASSWORD,
} from '@/src/utils/environmentConstants';
import { EmailProvider } from './email.provider';
import { renderNotification } from './notification.templates';
import {
  failedDelivery,
  safeDeliveryDiagnostics,
  safeDeliveryError,
} from './outbox-policy';

@Injectable()
export class OutboxWorker
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private timer?: NodeJS.Timeout;
  private running = false;
  private readonly log = new Logger(OutboxWorker.name);

  constructor(
    private readonly db: DataSource,
    private readonly email: EmailProvider,
  ) {}

  onApplicationBootstrap() {
    this.timer = setInterval(() => void this.runOnce(), 30_000);
    this.timer.unref();
  }

  onApplicationShutdown() {
    if (this.timer) clearInterval(this.timer);
  }

  async runOnce(now = new Date(), batch = 25) {
    if (EMAIL_PROVIDER === 'disabled') return 0;
    if (this.running) return 0;
    this.running = true;
    try {
      const rows = await this.db.transaction(async (manager) => {
        const repository = manager.getRepository(NotificationOutboxEntity);
        const claimed = await repository
          .createQueryBuilder('notification')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .where('notification.status IN (:...statuses)', {
            statuses: [OutboxStatus.PENDING, OutboxStatus.FAILED],
          })
          .andWhere(
            '(notification.nextAttemptAt IS NULL OR notification.nextAttemptAt <= :now)',
            { now },
          )
          .andWhere('notification.attempts < :maximumAttempts', {
            maximumAttempts: EMAIL_MAX_ATTEMPTS,
          })
          .orderBy('notification.created_at', 'ASC')
          .take(batch)
          .getMany();
        // A short lease prevents another worker from claiming these records.
        // Provider I/O happens only after this transaction has committed.
        for (const row of claimed) {
          row.nextAttemptAt = new Date(now.getTime() + 5 * 60_000);
        }
        await repository.save(claimed);
        return claimed;
      });

      for (const row of rows) {
        try {
          const rendered = renderNotification(row.type, row.payload);
          await this.email.sendMail({
            to: row.recipientEmail,
            subject: row.subject,
            ...rendered,
          });
          row.status = OutboxStatus.SENT;
          row.sentAt = new Date();
          row.lastError = null;
          row.nextAttemptAt = null;
        } catch (error) {
          Object.assign(
            row,
            failedDelivery(row.attempts, EMAIL_MAX_ATTEMPTS, now),
          );
          row.lastError = safeDeliveryError(error, [SMTP_PASSWORD]);
          const diagnostics = safeDeliveryDiagnostics(error, [SMTP_PASSWORD]);
          const details = [
            diagnostics.name && `name=${diagnostics.name}`,
            diagnostics.code && `code=${diagnostics.code}`,
            diagnostics.responseCode != null &&
              `responseCode=${diagnostics.responseCode}`,
            diagnostics.command && `command=${diagnostics.command}`,
            diagnostics.response && `response=${diagnostics.response}`,
          ]
            .filter(Boolean)
            .join(' ');
          this.log.warn(
            `Notification ${row.id} failed: ${diagnostics.message}${details ? ` (${details})` : ''}`,
          );
        }
        await this.db.getRepository(NotificationOutboxEntity).save(row);
      }
      return rows.length;
    } finally {
      this.running = false;
    }
  }
}
