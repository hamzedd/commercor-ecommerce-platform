import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const DB_TYPE = process.env.DB_TYPE;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
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
export const SMTP_SECURE =
  (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const SMTP_FROM_EMAIL =
  process.env.SMTP_FROM_EMAIL || 'no-reply@localhost';
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Commercor';
export const EMAIL_MAX_ATTEMPTS = Math.max(
  1,
  Number(process.env.EMAIL_MAX_ATTEMPTS || 5),
);
export const PASSWORD_RESET_EXPIRY_MINUTES = Math.max(1, Number(process.env.PASSWORD_RESET_EXPIRY_MINUTES || 30));
export const ABANDONED_CART_MINUTES = Math.max(1, Number(process.env.ABANDONED_CART_MINUTES || 60));
export const ABANDONED_CART_EMAIL_COOLDOWN_HOURS = Math.max(1, Number(process.env.ABANDONED_CART_EMAIL_COOLDOWN_HOURS || 24));
if (EMAIL_PROVIDER === 'smtp' && !SMTP_HOST)
  throw new Error('SMTP_HOST is required when EMAIL_PROVIDER=smtp');

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
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
export const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

if (
  PAYMENT_PROVIDER === 'paypal' &&
  (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_WEBHOOK_ID)
) {
  throw new Error(
    'PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET and PAYPAL_WEBHOOK_ID are required when PAYMENT_PROVIDER=paypal',
  );
}
