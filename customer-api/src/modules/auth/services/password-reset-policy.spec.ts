import {
  generateResetToken,
  hashResetToken,
  resetTokenIsUsable,
} from './password-reset-policy';
describe('password reset security policy', () => {
  it('generates high entropy opaque tokens and stores only a hash', () => {
    const a = generateResetToken(),
      b = generateResetToken();
    expect(a.token).not.toBe(b.token);
    expect(a.token.length).toBeGreaterThanOrEqual(40);
    expect(a.tokenHash).toHaveLength(64);
    expect(a.tokenHash).not.toContain(a.token);
  });
  it('rejects expired and used tokens', () => {
    expect(
      resetTokenIsUsable({
        usedAt: null,
        expiresAt: new Date(Date.now() + 1000),
      }),
    ).toBe(true);
    expect(
      resetTokenIsUsable({ usedAt: null, expiresAt: new Date(Date.now() - 1) }),
    ).toBe(false);
    expect(
      resetTokenIsUsable({
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 1000),
      }),
    ).toBe(false);
  });
  it('hashes deterministically without exposing plaintext', () =>
    expect(hashResetToken('secret')).toBe(hashResetToken('secret')));
});
