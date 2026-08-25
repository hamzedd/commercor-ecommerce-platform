import { NextFunction, Request, Response } from 'express';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function positiveInt(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] || String(fallback), 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );
  next();
}

// GET routes that only ever serve public, non-personalized storefront data.
// These are hit on every SSR page render (home, category, product, search),
// and since customer-web's SSR fetches all originate from the same upstream
// service, they land on customer-api under one shared IP for every visitor
// combined - so they need a much larger allowance than a single real client.
const PUBLIC_READ_GET_PATTERNS = [
  /\/categories(\/[^/]+)?$/,
  /\/company-details(\/[^/]+)?$/,
  /\/store-settings$/,
  /\/brands$/,
  /\/product-filters$/,
  /\/products\/slug\/[^/]+$/,
  /\/products\/[^/]+\/reviews(\/summary)?$/,
  /\/products\/[^/]+$/,
];

function isPublicReadRequest(req: Request): boolean {
  const path = req.path;
  if (req.method === 'GET') {
    return PUBLIC_READ_GET_PATTERNS.some((pattern) => pattern.test(path));
  }
  // The product listing/search endpoint takes its filters as a POST body,
  // but is a public read (no auth, no mutation) hit by every SSR render.
  if (req.method === 'POST') {
    return /\/products\/?$/.test(path);
  }
  return false;
}

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  const isWebhook = path.endsWith('/payments/webhooks/paypal');
  if (isWebhook) return next();
  const sensitive =
    req.method === 'POST' &&
    (/\/auth\/(login|register|forgot-password|reset-password)$/.test(path) ||
      /\/customers\/?$/.test(path) ||
      /\/payments\/[^/]+\/(initialize|paypal\/capture)$/.test(path) ||
      /\/(coupon|promotion)/.test(path));
  const publicRead = !sensitive && isPublicReadRequest(req);
  const windowMs = positiveInt('RATE_LIMIT_WINDOW_MS', 60_000);
  const limit = sensitive
    ? positiveInt('SENSITIVE_RATE_LIMIT_MAX', 20)
    : publicRead
      ? positiveInt('PUBLIC_READ_RATE_LIMIT_MAX', 1200)
      : positiveInt('RATE_LIMIT_MAX', 300);
  const bucketType = sensitive
    ? 'sensitive'
    : publicRead
      ? 'public-read'
      : 'api';
  const key = `${req.ip || req.socket.remoteAddress || 'unknown'}:${bucketType}`;
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  res.setHeader('RateLimit-Limit', String(limit));
  res.setHeader(
    'RateLimit-Remaining',
    String(Math.max(0, limit - bucket.count)),
  );
  res.setHeader('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));
  if (bucket.count > limit) {
    res.setHeader(
      'Retry-After',
      String(Math.ceil((bucket.resetAt - now) / 1000)),
    );
    res.status(429).json({ statusCode: 429, message: 'Too many requests' });
    return;
  }
  if (buckets.size > 10_000) {
    for (const [bucketKey, value] of buckets)
      if (value.resetAt <= now) buckets.delete(bucketKey);
  }
  next();
}

// Known-good origins that must always be allowed, regardless of whether the
// corresponding env var has been configured on the host. This is what the
// live Render frontend calls the API from - it must never depend on a
// dashboard env var being set correctly, or login breaks with no way to
// diagnose it beyond a bare CORS error in the browser.
const PRODUCTION_ORIGINS = ['https://commercor-customer-web.onrender.com'];
const DEV_ORIGINS = ['http://localhost:3002', 'http://localhost:5173'];

export function allowedOrigins() {
  const configured = [
    process.env.CUSTOMER_WEB_ORIGIN,
    process.env.ADMIN_WEB_ORIGIN,
    ...(process.env.CORS_ALLOWED_ORIGINS || '').split(','),
  ]
    .map((value) => value?.trim())
    .filter(Boolean) as string[];
  const devOrigins = process.env.NODE_ENV === 'production' ? [] : DEV_ORIGINS;
  return [...new Set([...PRODUCTION_ORIGINS, ...configured, ...devOrigins])];
}
