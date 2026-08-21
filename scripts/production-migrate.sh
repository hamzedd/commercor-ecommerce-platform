#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ENV_FILE=${1:-"$ROOT/.env.production"}
COMPOSE_FILE="$ROOT/docker-compose.production.yml"

test -f "$ENV_FILE" || { echo "Production environment file not found: $ENV_FILE" >&2; exit 1; }
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" config --quiet
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d postgres minio
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" --profile tools run --rm migrations
echo "Database migrations completed."
