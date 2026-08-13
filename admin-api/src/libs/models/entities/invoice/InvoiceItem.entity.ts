import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { InvoiceEntity } from './Invoice.entity';
@Entity('invoice_items')
export class InvoiceItemEntity extends BaseEntity {
  @Column() invoiceId: string;
  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice: InvoiceEntity;
  @Column({ nullable: true }) productId: string | null;
  @Column({ length: 500 }) productName: string;
  @Column({ nullable: true }) variantId: string | null;
  @Column({ nullable: true, length: 100 }) variantSku: string | null;
  @Column({ nullable: true, length: 1000 }) variantDescription: string | null;
  @Column({ type: 'integer' }) quantity: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) unitPrice: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) lineTotal: number;
}
