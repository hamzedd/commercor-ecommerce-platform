# Backup and restore

## PostgreSQL backup

Use `scripts/backup-postgres.sh` or `.ps1`. They create timestamped custom-format dumps and validate them with `pg_restore --list`. Supply `PGPASSWORD` only in the process environment. Schedule backups outside the application container and alert on non-zero exit.

PowerShell example:

```powershell
$env:PGPASSWORD='<secret from secret manager>'
./scripts/backup-postgres.ps1 -Database commercorDB -Destination D:\backups\commercor -HostName localhost -Port 5433 -Username commercorUser
Remove-Item Env:PGPASSWORD
```

## PostgreSQL restore drill

Never default a restore target. Create a new database such as `commercor_restore_test`, require exact target confirmation, and restore with no ownership/privilege replay:

```powershell
$env:PGPASSWORD='<secret>'
./scripts/restore-postgres.ps1 -Backup D:\backups\commercor\file.dump -TargetDatabase commercor_restore_test -ConfirmTarget commercor_restore_test -HostName localhost -Port 5433 -Username commercorUser -CreateTarget
```

Afterward run `migration:show`, compare representative counts for customers, products, orders, payments, invoices, and notification outbox, and start both APIs on alternate ports against the restored database. Drop only the explicitly verified test database using an administrative tool after disconnecting test clients. Never run the restore script against the live database during a drill.

## MinIO

Configure `mc alias set` using secret-manager values, then run `backup-minio.ps1`. It mirrors `commercor`, `products`, `categories`, `brands`, and `invoices` into a timestamped directory without deletion. Add buckets to `-Buckets` when the application gains them.

Restore drills use `restore-minio.ps1`, which creates separate prefixed buckets such as `restore-test-products`. Compare `mc ls --recursive --summarize` output, test sample objects, then remove only those test buckets after verification. Never mirror over production buckets during a drill.

## Retention and integrity

Recommended starting policy: seven daily, four weekly, and six monthly copies, with at least one encrypted off-host copy. Retention deletion is deliberately not automated by these scripts. Periodically checksum backup files, test restores, record duration, and ensure backup storage credentials cannot delete primary data. Set RPO/RTO targets appropriate to order volume.
