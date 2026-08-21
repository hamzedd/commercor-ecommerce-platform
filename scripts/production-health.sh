#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ENV_FILE=${1:-"$ROOT/.env.production"}
COMPOSE_FILE="$ROOT/docker-compose.production.yml"

test -f "$ENV_FILE" || { echo "Production environment file not found: $ENV_FILE" >&2; exit 1; }
compose() { docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"; }
compose config --quiet
compose ps
compose exec -T admin-api wget -q -O - http://127.0.0.1:3000/api/admin/health/ready
echo
compose exec -T customer-api wget -q -O - http://127.0.0.1:3001/api/health/ready
echo
compose exec -T customer-web wget -q -O /dev/null http://127.0.0.1:8080/en
compose exec -T admin-web wget -q -O /dev/null http://127.0.0.1:8080/admin/
echo "All internal health checks passed."
