import { effectiveThreshold, stockStatus } from './inventory-policy';
describe('inventory policy', () => {
  it('uses variant, product, then global thresholds', () => {
    expect(effectiveThreshold(2, 4)).toBe(2);
    expect(effectiveThreshold(null, 4)).toBe(4);
    expect(effectiveThreshold(null, null)).toBe(5);
  });
  it('normalizes statuses', () => {
    expect(stockStatus(0, 5)).toBe('out_of_stock');
    expect(stockStatus(5, 5)).toBe('low_stock');
    expect(stockStatus(6, 5)).toBe('in_stock');
  });
});
