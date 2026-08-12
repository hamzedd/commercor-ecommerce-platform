import { calculateAmounts } from './pricing-calculator';

describe('calculateAmounts', () => {
  it('disables shipping globally', () => expect(calculateAmounts(50, 'US', { shippingEnabled: false, defaultShippingFee: 10 }, null).shippingAmount).toBe(0));
  it('uses the default fee', () => expect(calculateAmounts(50, 'US', { shippingEnabled: true, defaultShippingFee: 10 }, null).shippingAmount).toBe(10));
  it('applies the free shipping threshold', () => expect(calculateAmounts(100, 'US', { shippingEnabled: true, defaultShippingFee: 10, freeShippingThreshold: 100 }, null).shippingAmount).toBe(0));
  it('uses an enabled country shipping override', () => expect(calculateAmounts(50, 'GE', { shippingEnabled: true, defaultShippingFee: 10 }, { shippingEnabled: true, shippingFee: 3 }).shippingAmount).toBe(3));
  it('disables tax globally', () => expect(calculateAmounts(100, 'US', { taxEnabled: false, defaultTaxRate: 20 }, null).taxAmount).toBe(0));
  it('uses default exclusive tax', () => expect(calculateAmounts(100, 'US', { taxEnabled: true, defaultTaxRate: 20, pricesIncludeTax: false }, null)).toMatchObject({ taxAmount: 20, total: 120 }));
  it('uses an enabled country tax override', () => expect(calculateAmounts(100, 'GE', { taxEnabled: true, defaultTaxRate: 20 }, { taxEnabled: true, taxRate: 18 }).taxAmount).toBe(18));
  it('extracts inclusive tax without adding it again', () => expect(calculateAmounts(120, 'US', { taxEnabled: true, defaultTaxRate: 20, pricesIncludeTax: true }, null)).toMatchObject({ taxAmount: 20, total: 120 }));
  it('does not tax shipping', () => expect(calculateAmounts(100, 'US', { shippingEnabled: true, defaultShippingFee: 10, taxEnabled: true, defaultTaxRate: 20 }, null)).toMatchObject({ shippingAmount: 10, taxAmount: 20, total: 130 }));
});
