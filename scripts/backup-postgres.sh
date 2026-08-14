#!/usr/bin/env sh
set -eu
: "${DB_NAME:?DB_NAME is required}"
: "${DB_USERNAME:?DB_USERNAME is required}"
: "${BACKUP_DESTINATION:?BACKUP_DESTINATION is required}"
: "${PGPASSWORD:?PGPASSWORD must be provided in the process environment}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
command -v pg_dump >/dev/null
command -v pg_restore >/dev/null
mkdir -p "$BACKUP_DESTINATION"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="$BACKUP_DESTINATION/${DB_NAME}-${stamp}.dump"
pg_dump --host "$DB_HOST" --port "$DB_PORT" --username "$DB_USERNAME" --dbname "$DB_NAME" --format custom --file "$output" --no-password
pg_restore --list "$output" >/dev/null
printf '%s\n' "$output"
