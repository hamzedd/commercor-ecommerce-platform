import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { RewardTransactionType } from '@/src/utils/enums/RewardEnums';
@Entity('reward_transactions')
@Index(['orderId', 'type'], { unique: true, where: '"orderId" IS NOT NULL' })
export class RewardTransactionEntity extends BaseEntity {
  @Column({ type: 'uuid' }) customerId: string;
  @Column({ type: 'uuid', nullable: true }) orderId: string | null;
  @Column({ type: 'uuid', nullable: true }) paymentId: string | null;
  @Column({ type: 'varchar' }) type: RewardTransactionType;
  @Column({ type: 'integer', nullable: true }) pointsAmount: number | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) cashbackAmount: number | null;
  @Column({ type: 'varchar', length: 500 }) description: string;
  @Column({ type: 'timestamp', nullable: true }) expiresAt: Date | null;
}
