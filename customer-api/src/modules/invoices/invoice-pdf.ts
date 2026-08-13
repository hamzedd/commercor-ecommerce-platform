import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';

const esc = (value: unknown) =>
  String(value ?? '')
    .replace(/([\\()])/g, '\\$1')
    .replace(/[\r\n]+/g, ' ');
const money = (value: unknown, currency: string) =>
  `${Number(value || 0).toFixed(2)} ${currency}`;

export function createInvoicePdf(
  invoice: InvoiceEntity & { currentRefundedAmount?: number },
) {
  const lines: Array<{ text: string; size?: number; bold?: boolean }> = [];
  const store = invoice.storeSnapshot || {};
  const customer = invoice.customerSnapshot || {};
  const address = invoice.shippingAddressSnapshot || {};
  lines.push({
    text: String(store.storeName || 'Commercor'),
    size: 20,
    bold: true,
  });
  if (store.contactEmail) lines.push({ text: String(store.contactEmail) });
  if (store.phone) lines.push({ text: String(store.phone) });
  if (store.address) lines.push({ text: String(store.address) });
  lines.push({
    text: `INVOICE ${invoice.invoiceNumber}`,
    size: 16,
    bold: true,
  });
  lines.push({
    text: `Issued: ${new Date(invoice.issuedAt).toISOString().slice(0, 10)}`,
  });
  lines.push({ text: `Order: ${invoice.orderId}` });
  lines.push({ text: '' });
  lines.push({ text: 'BILL TO', bold: true });
  lines.push({ text: `${customer.name || ''} <${customer.email || ''}>` });
  lines.push({
    text: [address.street, address.detail, address.city, address.country]
      .filter(Boolean)
      .join(', '),
  });
  if (address.phoneNumber) lines.push({ text: String(address.phoneNumber) });
  lines.push({ text: '' });
  lines.push({
    text: 'ITEM                                      QTY     UNIT          TOTAL',
    bold: true,
  });
  for (const item of invoice.items || []) {
    const label =
      `${item.productName}${item.variantDescription ? ` / ${item.variantDescription}` : ''}`.slice(
        0,
        40,
      );
    lines.push({
      text: `${label.padEnd(42)} ${String(item.quantity).padStart(3)}  ${money(item.unitPrice, invoice.currencyCode).padStart(12)}  ${money(item.lineTotal, invoice.currencyCode).padStart(12)}`,
    });
  }
  lines.push({ text: '' });
  const total = (label: string, value: unknown) =>
    lines.push({ text: `${label}: ${money(value, invoice.currencyCode)}` });
  total('Subtotal', invoice.subtotal);
  if (Number(invoice.couponDiscount))
    total('Coupon discount', -Number(invoice.couponDiscount));
  if (Number(invoice.pointsDiscount))
    total('Points discount', -Number(invoice.pointsDiscount));
  if (Number(invoice.cashbackUsed))
    total('Cashback', -Number(invoice.cashbackUsed));
  total('Shipping', invoice.shippingAmount);
  total('Tax', invoice.taxAmount);
  total('TOTAL', invoice.totalAmount);
  total('Paid', invoice.paidAmount);
  const refunded =
    invoice.currentRefundedAmount ?? Number(invoice.refundedAmount);
  if (refunded > 0) total('Refunded separately', refunded);
  if (invoice.paymentSnapshot?.provider)
    lines.push({ text: `Payment: ${invoice.paymentSnapshot.provider}` });

  let y = 800;
  const content: string[] = [];
  for (const line of lines) {
    const size = line.size || 10;
    const font = line.bold ? '/F2' : '/F1';
    content.push(`BT ${font} ${size} Tf 48 ${y} Td (${esc(line.text)}) Tj ET`);
    y -= size + 8;
  }
  const stream = content.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1))
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}
