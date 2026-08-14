import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const DB_TYPE = process.env.DB_TYPE;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const DB_POOL_MAX = Math.max(1, Number(process.env.DB_POOL_MAX || 10));
export const DB_CONNECTION_TIMEOUT_MS = Math.max(
  1000,
  Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000),
);
export const DB_IDLE_TIMEOUT_MS = Math.max(
  1000,
  Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
);
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;
export const DOMAIN_URL = process.env.DOMAIN_URL;
export const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || 'disabled')
  .trim()
  .toLowerCase();
if (!['disabled', 'smtp'].includes(EMAIL_PROVIDER))
  throw new Error('EMAIL_PROVIDER must be disabled or smtp');
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const smtpSecureValue = (process.env.SMTP_SECURE || 'false').toLowerCase();
export const SMTP_SECURE = smtpSecureValue === 'true';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const SMTP_FROM_EMAIL =
  process.env.SMTP_FROM_EMAIL || process.env.SMTP_FROM || 'no-reply@localhost';
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Commercor';
const emailMaxAttempts = Number(process.env.EMAIL_MAX_ATTEMPTS || 5);
if (!Number.isInteger(emailMaxAttempts) || emailMaxAttempts < 1)
  throw new Error('EMAIL_MAX_ATTEMPTS must be a positive integer');
export const EMAIL_MAX_ATTEMPTS = emailMaxAttempts;
export const PASSWORD_RESET_EXPIRY_MINUTES = Math.max(
  1,
  Number(process.env.PASSWORD_RESET_EXPIRY_MINUTES || 30),
);
export const ABANDONED_CART_MINUTES = Math.max(
  1,
  Number(process.env.ABANDONED_CART_MINUTES || 60),
);
export const ABANDONED_CART_EMAIL_COOLDOWN_HOURS = Math.max(
  1,
  Number(process.env.ABANDONED_CART_EMAIL_COOLDOWN_HOURS || 24),
);
if (EMAIL_PROVIDER === 'smtp') {
  if (!SMTP_HOST)
    throw new Error('SMTP_HOST is required when EMAIL_PROVIDER=smtp');
  if (!Number.isInteger(SMTP_PORT) || SMTP_PORT < 1 || SMTP_PORT > 65535)
    throw new Error('SMTP_PORT must be a valid TCP port');
  if (!['true', 'false'].includes(smtpSecureValue))
    throw new Error('SMTP_SECURE must be true or false');
  if (!process.env.SMTP_FROM_EMAIL?.trim() && !process.env.SMTP_FROM?.trim())
    throw new Error(
      'SMTP_FROM_EMAIL (or SMTP_FROM) is required when EMAIL_PROVIDER=smtp',
    );
  if (SMTP_USER && !SMTP_PASSWORD)
    throw new Error('SMTP_PASSWORD is required when SMTP_USER is configured');
}

export const PAYMENT_PROVIDER = (
  process.env.PAYMENT_PROVIDER || 'manual_disabled'
)
  .trim()
  .toLowerCase();

const pendingExpiryMinutes = Number.parseInt(
  process.env.PAYMENT_PENDING_EXPIRY_MINUTES || '30',
  10,
);

if (!Number.isInteger(pendingExpiryMinutes) || pendingExpiryMinutes <= 0) {
  throw new Error('PAYMENT_PENDING_EXPIRY_MINUTES must be a positive integer');
}

export const PAYMENT_PENDING_EXPIRY_MINUTES = pendingExpiryMinutes;

export const PAYPAL_ENV = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
if (!['sandbox', 'live'].includes(PAYPAL_ENV)) {
  throw new Error('PAYPAL_ENV must be sandbox or live');
}
if (PAYPAL_ENV === 'live' && process.env.PAYPAL_ALLOW_LIVE !== 'true') {
  throw new Error(
    'Live PayPal is disabled. Set PAYPAL_ALLOW_LIVE=true explicitly to enable it.',
  );
}
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
export const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

const required = [
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'DOMAIN_URL',
];
const missing = required.filter((name) => !process.env[name]?.trim());
if (process.env.NODE_ENV === 'production' && missing.length)
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}`,
  );
if (process.env.NODE_ENV === 'production' && (JWT_SECRET || '').length < 32)
  throw new Error('JWT_SECRET must be at least 32 characters in production');

if (
  PAYMENT_PROVIDER === 'paypal' &&
  (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_WEBHOOK_ID)
) {
  throw new Error(
    'PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET and PAYPAL_WEBHOOK_ID are required when PAYMENT_PROVIDER=paypal',
  );
}
