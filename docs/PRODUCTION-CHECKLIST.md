# Commercor Production Checklist

## Before deployment

- [ ] Provision PostgreSQL with TLS, least-privilege application credentials, connection limits, and no public exposure.
- [ ] Back up the database and object storage; test restore procedures and record retention/RPO/RTO.
- [ ] Run every TypeORM migration in order against a staging copy; confirm `synchronize=false` in both APIs.
- [ ] Store a unique 32+ character `JWT_SECRET` in a secret manager. Do not place secrets in images, source control, frontend variables, or logs.
- [ ] Set `NODE_ENV=production`, API ports, all DB variables, and explicit `CUSTOMER_WEB_ORIGIN` / `ADMIN_WEB_ORIGIN` (or `CORS_ALLOWED_ORIGINS`).
- [ ] Configure final public domains and `DOMAIN_URL`; verify reset and payment return URLs use HTTPS.
- [ ] Terminate TLS with modern protocols, redirect HTTP to HTTPS, and configure trusted proxy/network boundaries.
- [ ] Configure MinIO/S3-compatible storage with private credentials, TLS, bucket backups/lifecycle, and appropriate read policy. Set `UPLOAD_MAX_BYTES`.
- [ ] Keep `PAYPAL_ENV=sandbox` through staging. Before launch, set reviewed live credentials and webhook ID, register the exact HTTPS webhook URL, and perform a controlled low-value payment/refund test.
- [ ] Configure SMTP only after SPF, DKIM, DMARC, sender identity, bounce handling, and outbox monitoring are ready. Keep `EMAIL_PROVIDER=disabled` in non-mail environments.
- [ ] Tune rate-limit variables for expected traffic. Use a shared limiter before running multiple API replicas.

## Fresh database installation

- [ ] Create an empty PostgreSQL database owned by the least-privilege application role.
- [ ] Configure both API environment files with the same database connection and all required service variables.
- [ ] Build `admin-api`, then run `node node_modules/typeorm/cli.js -d dist/utils/migrationDataSource.js migration:run` from `admin-api`.
- [ ] Run `migration:show` and confirm every migration, beginning with `InitialSchema1786224000000`, is marked `[X]`.
- [ ] Bootstrap the first admin through an approved operational process. There is intentionally no default production password in migrations.
- [ ] Start both APIs and verify `/api/admin/health` and `/api/health` before exposing traffic.

For databases created before the baseline migration, take a verified backup and run the normal migration command. `InitialSchema1786224000000` validates that all legacy core tables exist and then records itself without recreating them. It aborts on a partial legacy schema. The following corrective migration safely adds any missing product-filter category indexes. Never manually insert the baseline migration record unless the documented validation has been performed.

## Observability and operations

- [ ] Monitor `GET /api/admin/health` and `GET /api/health`; add infrastructure-level DB/object-storage readiness probes if required.
- [ ] Centralize structured logs and alert on unexpected errors, migration/startup failures, payment failures, webhook verification failures, and permanently failed email outbox records.
- [ ] Ensure logs never retain passwords, JWTs, reset tokens, provider credentials, or full sensitive customer payloads.
- [ ] Alert on elevated 401/403/429/5xx rates, payment reconciliation differences, storage errors, and backup failures.

## Release and smoke tests

- [ ] Build and test all four applications from the exact release artifact; run dependency audit and `git diff --check`.
- [ ] Smoke-test customer home/category/product, six locales and RTL, register/login/reset structure, cart/wishlist, pricing/promotions, checkout/order/payment-status, profile/order/invoice.
- [ ] Smoke-test admin login, dashboard/analytics, catalog, CRM, orders/refunds, inventory, invoices, reviews, promotions/coupons, loyalty, shipping/tax, abandoned carts, and settings.
- [ ] Confirm unauthenticated admin requests return 401, non-admin requests return 403, and cross-customer resource IDs do not disclose data.
- [ ] Confirm CORS accepts only deployed origins and security headers are present. Test PayPal webhook signature rejection without rate-limit interference.
- [ ] Verify migrations and application startup on an empty disposable database before the first production release.

## Rollback basics

- [ ] Keep the previous immutable application artifact and configuration version available.
- [ ] Prefer forward corrective migrations. Before any destructive migration, document compatibility, backup, restore, and rollback steps.
- [ ] Roll back application replicas gradually while watching health/error/payment metrics; never roll back to code incompatible with the migrated schema.
- [ ] If payment processing is uncertain, disable new payment initialization, preserve all records, reconcile provider transactions, and resume only after verification.
