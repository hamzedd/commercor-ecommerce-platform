import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
@Injectable()
export class InvoicesService {
  constructor(private db: DataSource) {}
  async list() {
    const invoices = await this.db
      .getRepository(InvoiceEntity)
      .find({ relations: { items: true }, order: { issuedAt: 'DESC' } });
    return Promise.all(invoices.map((invoice) => this.get(invoice.id)));
  }
  async get(id: string) {
    const invoice = await this.db
      .getRepository(InvoiceEntity)
      .findOne({ where: { id }, relations: { items: true } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    const payment = await this.db
      .getRepository(PaymentEntity)
      .createQueryBuilder('p')
      .innerJoin(OrderEntity, 'o', 'o.paymentId=p.id')
      .where('o.id=:orderId', { orderId: invoice.orderId })
      .getOne();
    return Object.assign(invoice, {
      currentRefundedAmount: Number(payment?.refundedAmount || 0),
    });
  }
}
