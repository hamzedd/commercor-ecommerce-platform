import { canIssueInvoice } from './invoice-policy';
describe('invoice issuance policy', () => {
  it('issues for completed payments', () => expect(canIssueInvoice('completed')).toBe(true));
  it.each(['pending', 'failed', 'cancelled'])('%s payment has no invoice', (status) => expect(canIssueInvoice(status)).toBe(false));
});
