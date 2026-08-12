import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
@Entity('customer_reward_accounts')
@Index(['customerId'], { unique: true })
export class CustomerRewardAccountEntity extends BaseEntity {
  @Column({ type: 'uuid' }) customerId: string;
  @Column({ type: 'integer', default: 0 }) pointsBalance: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) cashbackBalance: number;
}
