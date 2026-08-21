# Production environment reference

Keep the production environment file on the deployment host with owner-only permissions. Start from `.env.production.example`; never commit the populated file. Values prefixed with `VITE_` or `NEXT_PUBLIC_` are public and compiled into browser assets.

## Domains and certificates

| Variable | Required | Example format | Purpose and security notes |
|---|---:|---|---|
| `STORE_DOMAIN` | yes | `shop.example.com` | Public storefront DNS name; no scheme or path. |
| `CUSTOMER_API_DOMAIN` | yes | `api.shop.example.com` | Public Customer API DNS name. |
| `ADMIN_DOMAIN` | yes | `admin.example.com` | Public Admin Web DNS name; restrict by VPN/IP policy when appropriate. |
| `ADMIN_API_DOMAIN` | yes | `admin-api.example.com` | Public Admin API DNS name. |
| `ACME_EMAIL` | yes | `ops@example.com` | Caddy certificate-expiry contact. |

`ADMIN_WEB_ORIGIN`, `CUSTOMER_WEB_ORIGIN`, `DOMAIN_URL`, `VITE_API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SSR_API_BASE_URL`, and `NEXT_PUBLIC_FILES_BASE_URL` are derived by the production Compose file. When deploying without Compose, supply exact HTTPS browser origins, public API/file URLs, and the private SSR API URL explicitly.

## PostgreSQL and API runtime

| Variable | Required | Example format | Purpose and security notes |
|---|---:|---|---|
| `POSTGRES_DB` | yes | `commercor` | Database initialized by the PostgreSQL container. |
| `POSTGRES_USER` | yes | `commercor_app` | Application database role; do not use a superuser remotely. |
| `POSTGRES_PASSWORD` | yes | long random secret | Store only in the protected environment/secret manager. |
| `DB_TYPE` | derived | `postgres` | Supported production database driver. |
| `DB_HOST`, `DB_PORT` | derived | `postgres`, `5432` | Private Compose hostname/port; never publish PostgreSQL by default. |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | derived | — | Mapped from `POSTGRES_*`. |
| `DB_POOL_MAX` | no | `10` | Connections per API process. Budget across replicas. |
| `DB_CONNECTION_TIMEOUT_MS` | no | `5000` | Database connection timeout. |
| `DB_IDLE_TIMEOUT_MS` | no | `30000` | Idle pool timeout. |
| `JWT_SECRET` | yes | 32+ random characters | Signs admin and customer JWTs with separate issuer/audience. Rotate deliberately; rotation logs users out. |
| `RATE_LIMIT_WINDOW_MS` | no | `60000` | In-memory limiter window. |
| `RATE_LIMIT_MAX` | no | `300` | General requests per resolved client IP/window. |
| `AUTH_RATE_LIMIT_MAX` | no | `10` | Admin authentication limit. |
| `SENSITIVE_RATE_LIMIT_MAX` | no | `20` | Customer auth/reset/payment-sensitive limit. |

## Object storage and uploads

| Variable | Required | Example format | Purpose and security notes |
|---|---:|---|---|
| `MINIO_ROOT_USER` | yes | random access key | Initializes private MinIO and becomes the Admin API access key in Compose. |
| `MINIO_ROOT_PASSWORD` | yes | long random secret | Protect as a production secret. |
| `MINIO_ENDPOINT`, `MINIO_PORT` | derived | `minio`, `9000` | Internal hostname and API port. |
| `MINIO_USE_SSL` | derived | `false` | Internal Compose traffic; TLS terminates at Caddy for public reads. |
| `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` | derived | — | Server-only credentials. |
| `UPLOAD_MAX_BYTES` | no | `5242880` | Maximum accepted image upload size. |

MinIO console port `9001` and API port `9000` are not published by production Compose.

## Payments

| Variable | Required | Example format | Purpose and security notes |
|---|---:|---|---|
| `PAYMENT_PROVIDER` | yes | `manual_disabled` or `paypal` | Keep `manual_disabled` until sandbox acceptance passes. |
| `PAYMENT_PENDING_EXPIRY_MINUTES` | no | `30` | Checkout reservation lifetime. |
| `PAYPAL_ENV` | with PayPal | `sandbox` or `live` | Provider endpoint selection. |
| `PAYPAL_CLIENT_ID` | with PayPal | provider value | Server credential; the public SDK client ID must be configured separately only when the storefront enables it. |
| `PAYPAL_CLIENT_SECRET` | with PayPal | provider secret | Server-only. Never expose through `NEXT_PUBLIC_*`. |
| `PAYPAL_WEBHOOK_ID` | with PayPal | provider webhook ID | Required for signature verification. |
| `PAYPAL_ALLOW_LIVE` | live only | `true` | Deliberate second switch; live mode fails fast without it. |

The API fails startup when PayPal is selected without complete credentials. Do not reuse sandbox webhook IDs in live mode.

## Email and customer lifecycle

| Variable | Required | Example format | Purpose and security notes |
|---|---:|---|---|
| `EMAIL_PROVIDER` | yes | `disabled` or `smtp` | Disabled mode retains queued work without pretending mail was sent. |
| `SMTP_HOST` | with SMTP | `smtp.example.com` | Mail relay host. |
| `SMTP_PORT` | with SMTP | `587` | Valid TCP port. |
| `SMTP_SECURE` | with SMTP | `false` | Use the provider's TLS mode. |
| `SMTP_USER`, `SMTP_PASSWORD` | provider-specific | secret-manager values | Password is required when a user is configured. |
| `SMTP_FROM_EMAIL` | with SMTP | `orders@example.com` | Verified sender. |
| `SMTP_FROM_NAME` | no | `Commercor` | Display name. |
| `EMAIL_MAX_ATTEMPTS` | no | `5` | Outbox retry ceiling. |
| `PASSWORD_RESET_EXPIRY_MINUTES` | no | `30` | Reset-token lifetime. |
| `ABANDONED_CART_MINUTES` | no | `60` | Inactivity threshold. |
| `ABANDONED_CART_EMAIL_COOLDOWN_HOURS` | no | `24` | Recovery-email cooldown. |

## CRM and first administrator

`CRM_NEW_CUSTOMER_DAYS`, `CRM_ACTIVE_DAYS`, `CRM_AT_RISK_DAYS`, `CRM_INACTIVE_DAYS`, `CRM_VIP_MIN_SPEND`, and `CRM_VIP_MIN_ORDERS` tune segmentation; defaults are documented in `.env.production.example`.

`ADMIN_BOOTSTRAP_USERNAME`, `ADMIN_BOOTSTRAP_EMAIL`, and `ADMIN_BOOTSTRAP_PASSWORD` are required only for the one-time `admin:create` command. Usernames are 3–50 safe characters. Passwords require 12+ characters with upper/lowercase, number, and symbol. Pass them through the process environment, then unset them; the command never prints the password and refuses duplicates.

## Validation

Run `docker compose --env-file .env.production -f docker-compose.production.yml config --quiet` before every deployment. Production APIs additionally fail startup for missing database/JWT/storage settings, short JWT secrets, invalid provider modes, incomplete PayPal/SMTP settings, or live PayPal without explicit authorization.
