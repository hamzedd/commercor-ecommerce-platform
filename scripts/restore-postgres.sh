#!/usr/bin/env sh
set -eu
: "${BACKUP_FILE:?BACKUP_FILE is required}"
: "${TARGET_DB:?TARGET_DB is required and has no default}"
: "${CONFIRM_TARGET:?CONFIRM_TARGET is required}"
: "${DB_USERNAME:?DB_USERNAME is required}"
: "${PGPASSWORD:?PGPASSWORD must be provided in the process environment}"
[ "$TARGET_DB" = "$CONFIRM_TARGET" ] || { echo 'CONFIRM_TARGET must exactly match TARGET_DB' >&2; exit 2; }
[ -f "$BACKUP_FILE" ] || { echo 'Backup file does not exist' >&2; exit 2; }
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
pg_restore --list "$BACKUP_FILE" >/dev/null
if [ "${CREATE_TARGET:-false}" = 'true' ]; then
  createdb --host "$DB_HOST" --port "$DB_PORT" --username "$DB_USERNAME" --no-password "$TARGET_DB"
fi
echo "WARNING: restoring into explicitly confirmed database '$TARGET_DB'" >&2
pg_restore --host "$DB_HOST" --port "$DB_PORT" --username "$DB_USERNAME" --dbname "$TARGET_DB" --no-password --exit-on-error --no-owner --no-privileges "$BACKUP_FILE"
