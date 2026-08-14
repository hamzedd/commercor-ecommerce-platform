import * as dotenv from 'dotenv';
dotenv.config();

export const DB_TYPE = process.env.DB_TYPE;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const PAYPAL_ENV = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

const required = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
if (process.env.NODE_ENV === 'production') required.push('MINIO_ENDPOINT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY');
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
if (process.env.NODE_ENV === 'production' && (JWT_SECRET || '').length < 32)
  throw new Error('JWT_SECRET must be at least 32 characters in production');
