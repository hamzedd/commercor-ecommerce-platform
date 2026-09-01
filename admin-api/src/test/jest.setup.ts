// Unit tests never open a real DB/JWT connection - everything is mocked -
// but environmentConstants.ts throws at import time if these are unset, and
// several services transitively import it (e.g. via paypal-refund.service.ts).
// Provide harmless defaults so unit specs can import those services at all.
process.env.DB_HOST ||= 'localhost';
process.env.DB_USERNAME ||= 'test';
process.env.DB_PASSWORD ||= 'test';
process.env.DB_NAME ||= 'test';
process.env.JWT_SECRET ||= 'test-jwt-secret-for-unit-tests-only';
