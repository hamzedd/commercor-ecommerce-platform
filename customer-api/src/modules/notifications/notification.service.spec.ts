import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  it('uses an atomic conflict-safe insert for deduplication', async () => {
    const execute = jest.fn().mockResolvedValue({ identifiers: [] });
    const orIgnore = jest.fn().mockReturnValue({ execute });
    const values = jest.fn().mockReturnValue({ orIgnore });
    const insert = jest.fn().mockReturnValue({ values });
    const createQueryBuilder = jest.fn().mockReturnValue({ insert });
    const repository = {
      create: jest.fn((value) => value),
      createQueryBuilder,
    };
    const manager = { getRepository: jest.fn(() => repository) };
    const customer = {
      id: 'qa-customer',
      email: 'qa@example.invalid',
      firstName: 'QA',
    };

    await new NotificationService().queueCustomer(
      manager as any,
      customer as any,
      'password_reset',
      'password_reset:qa-token',
      { resetUrl: 'https://store.test/reset' },
    );

    expect(insert).toHaveBeenCalledTimes(1);
    expect(orIgnore).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientEmail: 'qa@example.invalid',
        deduplicationKey: 'password_reset:qa-token',
      }),
    );
  });
});
