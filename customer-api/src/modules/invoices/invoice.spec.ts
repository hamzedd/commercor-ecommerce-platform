import { createInvoicePdf } from './invoice-pdf';
import { formatInvoiceNumber } from './invoices.service';

describe('invoice snapshots and PDF', () => {
  const invoice: any = {
    invoiceNumber: 'INV-2026-000001', orderId: 'order-reference', issuedAt: new Date('2026-08-13'), currencyCode: 'USD',
    subtotal: 100, couponDiscount: 10, pointsDiscount: 5, cashbackUsed: 2, shippingAmount: 8, taxAmount: 9,
    totalAmount: 100, paidAmount: 100, refundedAmount: 0, currentRefundedAmount: 25,
    customerSnapshot: { name: 'Historical Customer', email: 'customer@example.com' },
    shippingAddressSnapshot: { city: 'Tbilisi', street: 'Invoice Street' }, storeSnapshot: { storeName: 'Commercor' },
    paymentSnapshot: { provider: 'paypal' },
    items: [{ productName: 'Original Product', variantDescription: 'Black / Medium', quantity: 2, unitPrice: 50, lineTotal: 100 }],
  };

  it('formats sequence-backed, human-readable unique numbers', () => {
    expect(formatInvoiceNumber(new Date('2026-01-01'), 1)).toBe('INV-2026-000001');
    expect(formatInvoiceNumber(new Date('2026-01-01'), 2)).not.toBe(formatInvoiceNumber(new Date('2026-01-01'), 1));
  });

  it('creates an application/pdf-compatible document from immutable snapshots', () => {
    const pdf = createInvoicePdf(invoice);
    expect(pdf.subarray(0, 8).toString()).toBe('%PDF-1.4');
    expect(pdf.toString()).toContain('Original Product / Black / Medium');
    expect(pdf.toString()).toContain('Refunded separately: 25.00 USD');
    expect(pdf.toString()).toContain('Coupon discount: -10.00 USD');
  });

  it('does not mutate original issued totals when displaying a refund', () => {
    createInvoicePdf(invoice);
    expect(invoice.totalAmount).toBe(100);
    expect(invoice.refundedAmount).toBe(0);
    expect(invoice.currentRefundedAmount).toBe(25);
  });
});
