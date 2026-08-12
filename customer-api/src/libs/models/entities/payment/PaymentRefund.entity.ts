import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity('payment_refunds')
@Index(['externalRefundId'], { unique: true })
export class PaymentRefundEntity extends BaseEntity {
  @Column({ type: 'uuid' }) paymentId: string;
  @Column({ type: 'varchar' }) provider: string;
  @Column({ type: 'varchar' }) externalRefundId: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) amount: number;
  @Column({ type: 'timestamp' }) completedAt: Date;
}
