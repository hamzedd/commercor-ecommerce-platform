# Optional demo data strategy

Production startup never seeds catalog or customer data. For demonstrations, prefer a separate database and MinIO namespace restored from an approved, non-personal demo snapshot.

1. Create a dedicated environment/database whose name clearly contains `demo`.
2. Use Admin Web to create records prefixed `DEMO —` and stable SKUs such as `DEMO-AUDIO-001`.
3. Add owned or internally generated neutral placeholder images only; do not scrape retailer catalogs, trademarks, descriptions, reviews, or photography.
4. Include several categories and brands, simple and variant products, in-stock/low-stock/out-of-stock cases, one disabled product, and draft/active promotions.
5. Use invented customer identities on reserved example domains and a disabled/sandbox payment provider.
6. Export an approved PostgreSQL dump and MinIO mirror as the reusable demo snapshot. Document its version and checksums.
7. Reset only the isolated demo environment by restoring that snapshot. Never run demo loading against a production database.

An automated seed should be added only when stable business fixtures are agreed. It must require an explicit `ALLOW_DEMO_SEED=true`, reject `NODE_ENV=production`, use deterministic identifiers, and upsert rather than duplicate records.
