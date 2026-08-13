import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { Role } from '@/src/libs/decorators/roles.decorator';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { InvoicesService } from './invoices.service';
const esc = (v: unknown) => String(v ?? '').replace(/([\\()])/g, '\\$1');
function pdf(i: any) {
  const rows = [
    `INVOICE ${i.invoiceNumber}`,
    `Issued: ${new Date(i.issuedAt).toISOString().slice(0, 10)}`,
    `Customer: ${i.customerSnapshot?.name || ''} <${
      i.customerSnapshot?.email || ''
    }>`,
    ...i.items.map(
      (x: any) =>
        `${x.productName}${
          x.variantDescription ? ' / ' + x.variantDescription : ''
        } x${x.quantity} ${Number(x.lineTotal).toFixed(2)} ${i.currencyCode}`,
    ),
    `Subtotal: ${Number(i.subtotal).toFixed(2)}`,
    `Coupon: -${Number(i.couponDiscount).toFixed(2)}`,
    `Points: -${Number(i.pointsDiscount).toFixed(2)}`,
    `Cashback: -${Number(i.cashbackUsed).toFixed(2)}`,
    `Shipping: ${Number(i.shippingAmount).toFixed(2)}`,
    `Tax: ${Number(i.taxAmount).toFixed(2)}`,
    `TOTAL: ${Number(i.totalAmount).toFixed(2)} ${i.currencyCode}`,
    `Paid: ${Number(i.paidAmount).toFixed(2)}`,
    `Refunded separately: ${Number(i.currentRefundedAmount || 0).toFixed(2)}`,
  ];
  const stream = rows
    .map(
      (x: string, n: number) =>
        `BT /F1 ${n === 0 ? 18 : 10} Tf 48 ${800 - n * 18} Td (${esc(
          x,
        )}) Tj ET`,
    )
    .join('\n');
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let out = '%PDF-1.4\n';
  const offsets = [0];
  objs.forEach((o, n) => {
    offsets.push(Buffer.byteLength(out));
    out += `${n + 1} 0 obj\n${o}\nendobj\n`;
  });
  const start = Buffer.byteLength(out);
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((x) => `${String(x).padStart(10, '0')} 00000 n `)
    .join('\n')}\ntrailer << /Size ${
    objs.length + 1
  } /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(out);
}
@Controller('invoices')
@Role(UserRoleEnum.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}
  @Get() list() {
    return this.invoices.list();
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.invoices.get(id);
  }
  @Get(':id/pdf') async download(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoices.get(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    );
    res.send(pdf(invoice));
  }
}
