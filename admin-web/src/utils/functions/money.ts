/**
 * TypeORM/pg returns `decimal` columns as strings at runtime (to avoid
 * float precision loss), even though the entity/DTO types claim `number`.
 * Any monetary field coming from the API must be normalized through here
 * before arithmetic or `.toFixed()` - calling those directly on a raw API
 * value can throw ("x.toFixed is not a function") or silently string-concat
 * instead of adding.
 */
export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function formatMoney(value: unknown, fallback = 0): string {
  return toNumber(value, fallback).toFixed(2);
}
