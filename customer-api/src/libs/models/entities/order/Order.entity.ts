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

  @Column()
  productAmount: number;

  @Column()
  deliveryAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  finalTotal: number;

  @Column()
  status: string;
}
