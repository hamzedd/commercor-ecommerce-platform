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

export type SafeDeliveryDiagnostics = {
  message: string;
  name?: string;
  code?: string;
  response?: string;
  responseCode?: number;
  command?: string;
};

/**
 * Extracts a redacted, size-bounded summary of a delivery failure for
 * logging - never the raw error object (which could carry transport
 * internals, and for SMTP/nodemailer errors may echo back auth config),
 * and never the notification payload/rendered email body. Only the named
 * diagnostic fields nodemailer/SMTP transports commonly set are read.
 */
export function safeDeliveryDiagnostics(
  error: unknown,
  secrets: string[] = [],
): SafeDeliveryDiagnostics {
  const redact = (value: string) => {
    let result = value;
    for (const secret of secrets.filter(Boolean))
      result = result.replaceAll(secret, '[redacted]');
    return result;
  };
  const err = error as {
    name?: unknown;
    code?: unknown;
    response?: unknown;
    responseCode?: unknown;
    command?: unknown;
  };
  const diagnostics: SafeDeliveryDiagnostics = {
    message: safeDeliveryError(error, secrets),
  };
  if (typeof err?.name === 'string')
    diagnostics.name = redact(err.name).slice(0, 200);
  if (typeof err?.code === 'string' || typeof err?.code === 'number')
    diagnostics.code = redact(String(err.code)).slice(0, 200);
  if (typeof err?.response === 'string')
    diagnostics.response = redact(err.response).slice(0, 500);
  if (typeof err?.responseCode === 'number')
    diagnostics.responseCode = err.responseCode;
  if (typeof err?.command === 'string')
    diagnostics.command = redact(err.command).slice(0, 200);
  return diagnostics;
}
