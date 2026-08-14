import { OutboxStatus } from '@/src/libs/models/entities/notification/NotificationOutbox.entity';

export function isDeliverable(
  status: OutboxStatus,
  attempts: number,
  maximumAttempts: number,
) {
  return (
    status !== OutboxStatus.SENT &&
    attempts < maximumAttempts &&
    (status === OutboxStatus.PENDING || status === OutboxStatus.FAILED)
  );
}

export function failedDelivery(
  attempts: number,
  maximumAttempts: number,
  now: Date,
) {
  const nextAttempts = attempts + 1;
  return {
    attempts: nextAttempts,
    status: OutboxStatus.FAILED,
    nextAttemptAt:
      nextAttempts >= maximumAttempts
        ? null
        : new Date(
            now.getTime() + Math.min(3_600_000, 60_000 * 2 ** nextAttempts),
          ),
  };
}

export function safeDeliveryError(error: unknown, secrets: string[] = []) {
  let message = String((error as Error)?.message || error || 'Delivery failed');
  for (const secret of secrets.filter(Boolean))
    message = message.replaceAll(secret, '[redacted]');
  return message.slice(0, 2_000);
}
