import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';
import { InvoiceItemEntity } from '@/src/libs/models/entities/invoice/InvoiceItem.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { AddressEntity } from '@/src/libs/models/entities/customer/Address.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { createInvoicePdf } from './invoice-pdf';
import { canIssueInvoice } from './invoice-policy';

@Injectable()
export class InvoicesService {
  constructor(private readonly db: DataSource) {}

  async issue(
    manager: EntityManager,
    order: OrderEntity,
    payment: PaymentEntity,
  ) {
    if (!canIssueInvoice(payment.status))
      throw new BadRequestException('Only a completed payment can be invoiced');
    const repository = manager.getRepository(InvoiceEntity);
    const existing = await repository.findOneBy({ orderId: order.id });
    if (existing) return existing;
    const [customer, address, orderItems, settings, sequence] =
      await Promise.all([
        manager
          .getRepository(CustomerEntity)
          .findOneByOrFail({ id: order.customerId }),
        manager.getRepository(AddressEntity).findOneBy({ id: order.addressId }),
        manager.getRepository(OrderItemEntity).findBy({ orderId: order.id }),
        manager.getRepository(CompanyDetailEntity).find(),
        manager.query(`SELECT nextval('invoice_number_seq') AS value`),
      ]);
    const issuedAt = new Date();
    const invoiceNumber = formatInvoiceNumber(issuedAt, sequence[0].value);
    const store = Object.fromEntries(
      settings.map((setting) => [setting.key, setting.value || setting.image]),
    );
    const invoice = await repository.save(
      repository.create({
        invoiceNumber,
        orderId: order.id,
        customerId: order.customerId,
        status: 'issued',
        issuedAt,
        currencyCode: (payment.currencyCode || 'USD').toUpperCase(),
        subtotal: Number(order.productAmount),
        couponDiscount: Number(order.couponDiscountAmount),
        pointsDiscount: Number(order.pointsDiscountAmount),
        cashbackUsed: Number(order.cashbackUsed),
        shippingAmount: Number(order.deliveryAmount),
        taxAmount: Number(order.taxAmount),
        totalAmount: Number(order.finalTotal),
        paidAmount: Number(payment.paidAmount),
        refundedAmount: Number(payment.refundedAmount || 0),
        customerSnapshot: {
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          email: customer.email,
        },
        billingAddressSnapshot: address
          ? {
              country: address.country,
              city: address.city,
              street: address.street,
              detail: address.detail,
              phoneNumber: address.phoneNumber,
            }
          : null,
        shippingAddressSnapshot: address
          ? {
              country: address.country,
              city: address.city,
              street: address.street,
              detail: address.detail,
              phoneNumber: address.phoneNumber,
            }
          : null,
        storeSnapshot: {
          storeName: store.store_name || 'Commercor',
          contactEmail: store.contact_email || null,
          phone: store.phone || null,
          address: store.address || null,
          logo: store.logo || null,
        },
        paymentSnapshot: {
          provider: payment.provider,
          reference: payment.externalTransactionId,
        },
      }),
    );
    const products = await manager.getRepository(ProductEntity).find({
      where: orderItems.map((item) => ({ id: item.productId })),
      relations: { translations: true },
    });
    const names = new Map(
      products.map((product) => [
        product.id,
        product.translations?.find((translation) => translation.lang === 'en')
          ?.name ||
          product.translations?.[0]?.name ||
          'Product',
      ]),
    );
    await manager.getRepository(InvoiceItemEntity).save(
      orderItems.map((item) =>
        manager.getRepository(InvoiceItemEntity).create({
          invoiceId: invoice.id,
          productId: item.productId,
          productName: names.get(item.productId) || 'Product',
          variantId: item.variantId,
          variantSku: item.variantSku,
          variantDescription: item.variantDescription,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(
            (Number(item.unitPrice) * item.quantity).toFixed(2),
          ),
        }),
      ),
    );
    return invoice;
  }

  list(customerId: string) {
    return this.db
      .getRepository(InvoiceEntity)
      .find({
        where: { customerId },
        relations: { items: true },
        order: { issuedAt: 'DESC' },
      });
  }
  async get(customerId: string, id: string) {
    const invoice = await this.db
      .getRepository(InvoiceEntity)
      .findOne({ where: { id }, relations: { items: true } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.customerId !== customerId)
      throw new ForbiddenException('Invoice does not belong to customer');
    const payment = await this.db
      .getRepository(PaymentEntity)
      .createQueryBuilder('payment')
      .innerJoin(OrderEntity, 'orders', 'orders.paymentId = payment.id')
      .where('orders.id = :orderId', { orderId: invoice.orderId })
      .getOne();
    return Object.assign(invoice, {
      currentRefundedAmount: Number(payment?.refundedAmount || 0),
    });
  }
  async pdf(customerId: string, id: string) {
    return createInvoicePdf(await this.get(customerId, id));
  }
}

export function formatInvoiceNumber(issuedAt: Date, sequence: string | number) {
  return `INV-${issuedAt.getUTCFullYear()}-${String(sequence).padStart(6, '0')}`;
}
