import { compareHashString, hashString } from './hashFunctions';

describe('password hashing', () => {
  it('uses a unique bcrypt salt for each hash', async () => {
    const first = await hashString('LaunchReady!Password1');
    const second = await hashString('LaunchReady!Password1');
    expect(first).not.toBe(second);
    await expect(
      compareHashString({ input: 'LaunchReady!Password1', hash: first }),
    ).resolves.toBe(true);
  });
});
