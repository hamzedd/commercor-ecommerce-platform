import { createHash, randomBytes } from 'crypto';
export const GENERIC_RESET_RESPONSE =
  'If an account exists for this email, a password reset link has been sent.';
export function generateResetToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashResetToken(token) };
}
export function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
export function resetTokenIsUsable(
  token: { usedAt: Date | null; expiresAt: Date },
  now = new Date(),
) {
  return !token.usedAt && token.expiresAt.getTime() > now.getTime();
}
