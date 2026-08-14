# Environment configuration

Copy `.env.production.example` to a host-local secret file that is never committed. Docker Compose interpolates it with `--env-file`. Browser-prefixed variables are public and are compiled into frontend assets; never place secrets in them.

## Shared API and database

| Variable | Required | Safe example | Notes |
|---|---:|---|---|
| `NODE_ENV` | yes | `production` | Enables production validation and behavior. |
| `DB_TYPE` | yes | `postgres` | PostgreSQL is the supported production database. |
| `DB_HOST`, `DB_PORT` | yes | `postgres`, `5432` | Use private networking; do not expose PostgreSQL publicly. |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | yes | `commercor`, `commercor_app`, secret | Use a least-privilege role and secret injection. |
| `DB_POOL_MAX` | no | `10` | Per-API-process maximum. Budget total connections across replicas. |
| `DB_CONNECTION_TIMEOUT_MS` | no | `5000` | Fail quickly when PostgreSQL is unavailable. |
| `DB_IDLE_TIMEOUT_MS` | no | `30000` | Releases idle pooled connections. |
| `JWT_SECRET` | yes | 32+ random characters | Shared by the two APIs in the current architecture; rotate deliberately. |
| `ADMIN_WEB_ORIGIN`, `CUSTOMER_WEB_ORIGIN` | yes | HTTPS origins | Exact CORS origins, without paths. |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | no | `60000`, `300` | Limiter is process-local. |

## Customer API

`DOMAIN_URL` is the public HTTPS storefront origin used for reset, cart, order, and payment links. `SENSITIVE_RATE_LIMIT_MAX` controls sensitive routes. `PAYMENT_PENDING_EXPIRY_MINUTES`, `PASSWORD_RESET_EXPIRY_MINUTES`, `ABANDONED_CART_MINUTES`, and `ABANDONED_CART_EMAIL_COOLDOWN_HOURS` control worker policies.

Payments remain disabled with `PAYMENT_PROVIDER=manual_disabled`. PayPal requires `PAYMENT_PROVIDER=paypal`, `PAYPAL_ENV=sandbox`, client ID, client secret, and webhook ID. Live mode additionally requires the deliberate `PAYPAL_ALLOW_LIVE=true` guard. Secrets and webhook IDs are server-only.

Email uses `EMAIL_PROVIDER=disabled|smtp`. SMTP mode requires host, a valid port, boolean secure setting, and `SMTP_FROM_EMAIL` (or `SMTP_FROM`). User/password are optional for unauthenticated local relays, but a configured user requires a password. `EMAIL_MAX_ATTEMPTS` must be a positive integer.

## Admin API

MinIO uses `MINIO_ENDPOINT` without a URL scheme, `MINIO_PORT`, `MINIO_USE_SSL`, access key, and secret key. `UPLOAD_MAX_BYTES` limits uploads. CRM thresholds are configured with the `CRM_*` variables in the examples. Admin PayPal refund operations use the server-side PayPal variables.

The first-admin CLI reads `ADMIN_BOOTSTRAP_USERNAME`, `ADMIN_BOOTSTRAP_EMAIL`, and `ADMIN_BOOTSTRAP_PASSWORD`. Supply these only to the one command and unset them afterward.

## Web applications

`VITE_API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, and `NEXT_PUBLIC_FILES_BASE_URL` are public HTTPS endpoints compiled at build time. `NEXT_PUBLIC_SSR_API_BASE_URL` may use the private Compose service URL. Rebuild web images when public URLs change.

## Compose host variables

`STORE_DOMAIN`, `CUSTOMER_API_DOMAIN`, `ADMIN_DOMAIN`, and `ADMIN_API_DOMAIN` must resolve to the proxy. `ACME_EMAIL` registers Caddy certificates. `POSTGRES_*` and `MINIO_ROOT_*` initialize persistent services and must come from a protected environment file or secret manager.
