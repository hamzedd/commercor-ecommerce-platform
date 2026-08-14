import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { AddressEntity } from '@/src/libs/models/entities/customer/Address.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.id)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column()
  customerId: string;

  @ManyToOne(() => PaymentEntity, (payment) => payment.id)
  @JoinColumn({ name: 'paymentId' })
  payment: PaymentEntity;

  @Column({ nullable: true })
  paymentId: string;

  @ManyToOne(() => AddressEntity, (address) => address.id)
  @JoinColumn({ name: 'addressId' })
  address: AddressEntity;

  @Column()
  addressId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  productAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  deliveryAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  finalTotal: number;
  @Column({ type: 'integer', default: 0 }) pointsRedeemed: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) pointsDiscountAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) cashbackUsed: number;
  @Column({ type: 'varchar', nullable: true }) couponId: string | null;
  @Column({ type: 'varchar', nullable: true, length: 100 }) couponCode: string | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) couponDiscountAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) promotionDiscountAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) shippingDiscountAmount: number;
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" }) promotionSnapshot: Array<{id:string;name:string;type:string;discountAmount:number;shippingDiscount:number}>;

  @Column()
  status: string;
  @Column({ length: 20, default: 'pending' }) fulfillmentStatus: string;
  @Column({ type: 'varchar', nullable: true, length: 200 }) carrier: string | null;
  @Column({ type: 'varchar', nullable: true, length: 200 }) trackingNumber: string | null;
  @Column({ type: 'varchar', nullable: true, length: 2000 }) trackingUrl: string | null;
  @Column({ type: 'timestamp', nullable: true }) processingAt: Date | null;
  @Column({ type: 'timestamp', nullable: true }) shippedAt: Date | null;
  @Column({ type: 'timestamp', nullable: true }) deliveredAt: Date | null;
  @Column({ type: 'timestamp', nullable: true }) cancelledAt: Date | null;
}
