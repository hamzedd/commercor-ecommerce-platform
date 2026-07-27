import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @Column()
  totalAmount: number;

  @Column()
  refundedAmount: number;

  @Column()
  status: string;
}
