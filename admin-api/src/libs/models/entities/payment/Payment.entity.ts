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

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  paidAmount: number | null;

  @Column({ type: 'varchar', length: 3, nullable: true })
  currencyCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  provider: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  externalTransactionId: string | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  cancellationReason: string | null;
}
