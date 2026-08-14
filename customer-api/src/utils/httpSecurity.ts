import { NextFunction, Request, Response } from 'express';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function positiveInt(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] || String(fallback), 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  const isWebhook = path.endsWith('/payments/webhooks/paypal');
  if (isWebhook) return next();
  const sensitive = req.method === 'POST' && (
    /\/auth\/(login|register|forgot-password|reset-password)$/.test(path) ||
    /\/customers\/?$/.test(path) ||
    /\/payments\/[^/]+\/(initialize|paypal\/capture)$/.test(path) ||
    /\/(coupon|promotion)/.test(path)
  );
  const windowMs = positiveInt('RATE_LIMIT_WINDOW_MS', 60_000);
  const limit = sensitive
    ? positiveInt('SENSITIVE_RATE_LIMIT_MAX', 20)
    : positiveInt('RATE_LIMIT_MAX', 300);
  const key = `${req.ip || req.socket.remoteAddress || 'unknown'}:${sensitive ? 'sensitive' : 'api'}`;
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  res.setHeader('RateLimit-Limit', String(limit));
  res.setHeader('RateLimit-Remaining', String(Math.max(0, limit - bucket.count)));
  res.setHeader('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));
  if (bucket.count > limit) {
    res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
    res.status(429).json({ statusCode: 429, message: 'Too many requests' });
    return;
  }
  if (buckets.size > 10_000) {
    for (const [bucketKey, value] of buckets)
      if (value.resetAt <= now) buckets.delete(bucketKey);
  }
  next();
}

export function allowedOrigins() {
  const configured = [
    process.env.CUSTOMER_WEB_ORIGIN,
    process.env.ADMIN_WEB_ORIGIN,
    ...(process.env.CORS_ALLOWED_ORIGINS || '').split(','),
  ].map((value) => value?.trim()).filter(Boolean) as string[];
  if (configured.length) return [...new Set(configured)];
  return process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3002', 'http://localhost:5173'];
}
