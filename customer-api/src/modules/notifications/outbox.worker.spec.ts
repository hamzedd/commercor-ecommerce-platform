import { OutboxWorker } from './outbox.worker';

describe('OutboxWorker', () => {
  it('does not consume queued notifications when email is disabled', async () => {
    const database = { transaction: jest.fn() };
    const email = { sendMail: jest.fn() };
    const worker = new OutboxWorker(database as any, email as any);

    await expect(worker.runOnce()).resolves.toBe(0);
    expect(database.transaction).not.toHaveBeenCalled();
    expect(email.sendMail).not.toHaveBeenCalled();
  });
});
