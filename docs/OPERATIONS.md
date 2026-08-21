# Operations runbook

## Health and configuration state

- Customer API: `/api/health`, `/api/health/live`, `/api/health/ready`
- Admin API: `/api/admin/health`, `/api/admin/health/live`, `/api/admin/health/ready`
- Notification outbox counts: authenticated admin `GET /api/admin/system/notifications`

Liveness means the process responds. Customer readiness verifies PostgreSQL and reports only payment/email provider names and environment state. Admin readiness verifies PostgreSQL and MinIO. No endpoint returns credentials.

Run `scripts/production-health.sh` after each deployment. Configure an external monitor for both readiness URLs and storefront/admin HTML, and alert on sustained failures rather than a single transient response.

## Logs and restarts

```sh
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs --since 30m admin-api customer-api proxy
docker compose --env-file .env.production -f docker-compose.production.yml restart customer-api
```

Use request IDs to correlate client errors with API logs. Never paste authorization headers, reset links, PayPal payload secrets, or environment files into tickets. A restart must not run migrations implicitly.

## Common symptoms

| Symptom | Checks |
|---|---|
| API readiness 503 | PostgreSQL health/disk/connections; Admin API also checks MinIO reachability. |
| Images unavailable | Admin readiness, MinIO capacity, proxy route, bucket/object existence. |
| Checkout remains pending | Payment provider state, expiry worker logs, payment expiry timestamp, webhook delivery. Do not clear database references manually. |
| Email not delivered | `EMAIL_PROVIDER`, SMTP connectivity, authenticated outbox statistics, oldest pending/failed counts. |
| Browser CORS error | Exact HTTPS domain variables and proxy DNS; never enable wildcard credentialed CORS. |
| Certificates unavailable | DNS, ports 80/443, Caddy logs, and `ACME_EMAIL`. |

## Backups and capacity

Follow `BACKUP-RESTORE.md`. Confirm the latest PostgreSQL dump passes `pg_restore --list`, confirm MinIO mirror summaries, maintain encrypted off-server copies, and run isolated restore drills. Monitor PostgreSQL/MinIO/host disk, container restarts, backup age, pending notifications, payment failure rates, and low inventory.

## Incident-safe service procedure

Before migrations or schema-sensitive rollback: take backups, stop writers if required, record current image digests and migration state, and test restore into separate targets. `scripts/production-down.sh` never removes volumes. Never add `--volumes` during ordinary restart or rollback.
