# Commercor Security Model

## Authentication and authorization

Admin and customer APIs issue separate one-day JWTs. Tokens are signed with `JWT_SECRET` and constrained by distinct issuer and audience values, so a customer token cannot authenticate to the admin API (or vice versa). Guards re-load the account from the database and fail closed for missing, malformed, expired, deleted, or unknown users. Admin management controllers require both authentication and the `ADMIN` role.

Changing a password does not currently revoke already-issued stateless JWTs. Keep access-token lifetime short and plan token-version or session revocation before supporting high-risk account takeover response.

## Passwords and resets

Passwords use bcrypt. DTO validation enforces password requirements. Forgot-password always returns the same response. Reset tokens are random, stored only as SHA-256 hashes, expire, are locked during use, and are marked used once. Creating or consuming a reset invalidates the customer's other outstanding reset tokens. Authentication and reset endpoints are IP-throttled. Never log passwords, reset URLs, reset tokens, or authorization headers.

## Payments and PayPal

Payment amounts and currencies come from persisted orders/payments, never browser input. Initialization and capture verify customer ownership, pending/expiry state, and the stored provider order reference. Provider calls use idempotency keys; database uniqueness and state transitions protect completion/refund replay. PayPal webhooks use the raw body and PayPal signature-verification API before normalized events are processed. Webhooks bypass the general IP limiter so provider delivery is not blocked; signature failure remains the security boundary. Never use live credentials in development or automated tests.

## HTTP controls

Both APIs use DTO transformation and property whitelisting; the customer API rejects unknown properties. APIs emit nosniff, frame-denial, referrer, cross-origin, and permissions-policy headers. CSP is intentionally deferred because Next.js, Vite, and PayPal script/connect requirements need a deployment-specific tested policy.

Rate limits are per proxy-resolved IP and in-memory per API process. Configure `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX`, and `SENSITIVE_RATE_LIMIT_MAX`. Multi-instance production deployments should replace the in-memory store with a shared Redis-backed limiter.

## Production environment

Production requires database credentials, a 32+ character `JWT_SECRET`, and the documented service-specific critical values. Admin object-storage settings are required. PayPal and SMTP credentials are required only when their providers are enabled. CORS allows only `CUSTOMER_WEB_ORIGIN`, `ADMIN_WEB_ORIGIN`, or comma-separated `CORS_ALLOWED_ORIGINS`; an absent production allowlist permits no browser origins. Never use wildcard CORS with credentials.

Uploads are restricted to JPEG, PNG, WebP, and GIF, use generated object names, and default to 5 MiB maximum (`UPLOAD_MAX_BYTES`). Bucket and object-name reads are validated. File content is not malware-scanned; add asynchronous scanning if untrusted document uploads are introduced.

## Error handling and known limitations

Validation errors remain actionable. Unexpected failures are logged server-side while clients receive a generic structured 500 response without stack traces, SQL, paths, or credentials. Logs must be access-controlled and scrubbed by the deployment platform.

Known limitations: stateless JWT revocation, single-process rate-limit state, deferred CSP, no automated malware scanning, and health endpoints report process liveness rather than database readiness.
