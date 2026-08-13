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
