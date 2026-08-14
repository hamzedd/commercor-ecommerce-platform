import { OutboxStatus } from '@/src/libs/models/entities/notification/NotificationOutbox.entity';
import {
  failedDelivery,
  isDeliverable,
  safeDeliveryError,
} from './outbox-policy';

describe('notification outbox retry policy', () => {
  it('increments attempts and schedules a retry', () => {
    const now = new Date('2026-08-13T12:00:00Z');
    const result = failedDelivery(0, 5, now);

    expect(result.attempts).toBe(1);
    expect(result.status).toBe(OutboxStatus.FAILED);
    expect(result.nextAttemptAt!.getTime()).toBeGreaterThan(now.getTime());
  });

  it('never retries a sent notification', () => {
    expect(isDeliverable(OutboxStatus.SENT, 0, 5)).toBe(false);
  });

  it('stops scheduling after the maximum attempt', () => {
    const result = failedDelivery(4, 5, new Date());

    expect(result.attempts).toBe(5);
    expect(result.nextAttemptAt).toBeNull();
    expect(isDeliverable(result.status, result.attempts, 5)).toBe(false);
  });

  it('uses exponential backoff without spinning continuously', () => {
    const now = new Date('2026-08-13T12:00:00Z');
    expect(failedDelivery(0, 5, now).nextAttemptAt?.getTime()).toBe(
      now.getTime() + 120_000,
    );
    expect(failedDelivery(1, 5, now).nextAttemptAt?.getTime()).toBe(
      now.getTime() + 240_000,
    );
  });

  it('redacts an SMTP password from persisted delivery errors', () => {
    expect(
      safeDeliveryError(new Error('Authentication failed: top-secret'), [
        'top-secret',
      ]),
    ).toBe('Authentication failed: [redacted]');
  });
});
