# Production deployment

## Architecture

Caddy terminates HTTPS and routes four DNS names to Customer Web (Next.js), Admin Web (static Nginx), Customer API, and Admin API. Both APIs use one private PostgreSQL database. Admin API uses private MinIO storage and exposes allow-listed objects through its file endpoint. PostgreSQL and MinIO data live in named volumes; neither is published to the host by the production Compose file.

This model targets one server and one Customer API replica. The notification, abandoned-cart, and payment-expiry workers use database locks and idempotency, but HTTP rate limiting is process-local. Introduce a shared limiter before horizontal scaling.

## Prerequisites and DNS

Install Docker Engine with Compose v2. Point the four configured DNS records to the server. Allow inbound TCP 80/443 and UDP 443. Keep database, MinIO, and admin infrastructure ports private. Caddy obtains and renews public certificates automatically; all application URLs and CORS origins must use HTTPS.

## Release sequence

The repository includes safe wrappers for the standard sequence. After creating
and reviewing `.env.production`, run `sh scripts/production-up.sh
.env.production`, then `sh scripts/production-health.sh .env.production`.
The wrapper validates Compose configuration, builds images, starts PostgreSQL
and MinIO, runs migrations, and starts the remaining services. Use `sh
scripts/production-down.sh .env.production` to stop containers without deleting
persistent volumes.

1. Create and validate PostgreSQL and object-storage backups. Review `migration:show`, release notes, compatibility, and rollback plan.
2. Build immutable images: `docker compose --env-file .env.production -f docker-compose.production.yml build`.
3. Run migrations explicitly: `docker compose --env-file .env.production -f docker-compose.production.yml --profile tools run --rm migrations`.
4. Run the same command with migration `migration:show` if verification is required. Never enable TypeORM synchronization.
5. Start services: `docker compose --env-file .env.production -f docker-compose.production.yml up -d`.
6. Verify readiness and smoke URLs below before directing traffic.

Migrations are intentionally not part of API container startup. Prefer forward corrective migrations. Restore only after an incident decision and verified backup.

The complete variable contract is in `PRODUCTION-ENVIRONMENT.md`; routine
health, logs, restart, and incident procedures are in `OPERATIONS.md`.

## First administrator

After migrations, inject a unique username, valid email, and strong password (12+ characters with upper, lower, number, and symbol) into the process environment, then run:

```sh
docker compose --env-file .env.production -f docker-compose.production.yml run --rm -e ADMIN_BOOTSTRAP_USERNAME -e ADMIN_BOOTSTRAP_EMAIL -e ADMIN_BOOTSTRAP_PASSWORD admin-api node dist/scripts/create-admin.js
```

The command hashes the password, refuses duplicate usernames/emails, creates only the admin role, and exposes no HTTP endpoint or default credentials. Unset the variables immediately.

## Health and smoke checks

- Customer Web: `https://STORE_DOMAIN/en`
- Customer API liveness/readiness: `/api/health/live`, `/api/health/ready`
- Admin Web: `https://ADMIN_DOMAIN/admin/`
- Admin API liveness/readiness: `/api/admin/health/live`, `/api/admin/health/ready`
- Existing `/api/health` and `/api/admin/health` remain compatibility liveness endpoints.

Readiness executes `SELECT 1`; it returns no infrastructure credentials. API responses include `X-Request-Id`, and unexpected error logs include that ID.

## Monitoring and logging

Poll all four smoke endpoints every 15 minutes from outside the host. Alert on sustained 5xx/latency, payment failure spikes, pending-payment growth, email failures/old pending rows, abandoned-cart worker failures, PostgreSQL connection/disk pressure, MinIO capacity/errors, low host disk, and failed or stale backups.

Admins can query counts only at `GET /api/admin/system/notifications`; content, recipients, and reset tokens are never returned. Nest logging includes timestamps/levels; collect stdout/stderr with the container runtime. Add Sentry or OpenTelemetry in `main.ts` before global filters if centralized tracing becomes necessary, scrubbing authorization, cookies, tokens, payment payloads, and passwords.

## Rollback

Keep the previous images and environment revision. Roll application images back only when schema-compatible. Prefer a forward migration correction. If schema rollback is unavoidable, stop writers, preserve payment/webhook records, verify the backup, restore into a new database first, and follow the incident plan in `BACKUP-RESTORE.md`.
