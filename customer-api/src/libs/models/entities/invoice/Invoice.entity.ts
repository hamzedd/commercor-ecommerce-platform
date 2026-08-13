import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { InvoiceItemEntity } from './InvoiceItem.entity';

@Entity('invoices')
@Index('UQ_invoice_number', ['invoiceNumber'], { unique: true })
@Index('UQ_invoice_order', ['orderId'], { unique: true })
@Index('IDX_invoice_customer_issued', ['customerId', 'issuedAt'])
export class InvoiceEntity extends BaseEntity {
  @Column({ length: 30 }) invoiceNumber: string;
  @Column() orderId: string;
  @Column() customerId: string;
  @Column({ length: 20, default: 'issued' }) status: string;
  @Column({ type: 'timestamp' }) issuedAt: Date;
  @Column({ length: 3 }) currencyCode: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) subtotal: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  couponDiscount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  pointsDiscount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cashbackUsed: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  shippingAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) totalAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) paidAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  refundedAmount: number;
  @Column({ type: 'jsonb' }) customerSnapshot: Record<string, unknown>;
  @Column({ type: 'jsonb', nullable: true }) billingAddressSnapshot: Record<
    string,
    unknown
  > | null;
  @Column({ type: 'jsonb', nullable: true }) shippingAddressSnapshot: Record<
    string,
    unknown
  > | null;
  @Column({ type: 'jsonb' }) storeSnapshot: Record<string, unknown>;
  @Column({ type: 'jsonb' }) paymentSnapshot: Record<string, unknown>;
  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice)
  items: InvoiceItemEntity[];
}
