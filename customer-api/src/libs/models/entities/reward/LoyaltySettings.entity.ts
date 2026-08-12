import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { RewardsGrantedOn } from '@/src/utils/enums/RewardEnums';
@Entity('loyalty_settings')
export class LoyaltySettingsEntity extends BaseEntity {
  @Column({ default: false }) pointsEnabled: boolean;
  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 }) pointsPerCurrencyUnit: number;
  @Column({ type: 'decimal', precision: 12, scale: 4, default: 100 }) pointsPerCurrencyRedemptionUnit: number;
  @Column({ type: 'integer', default: 0 }) minimumPointsToRedeem: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) maximumPointsRedemptionPercent: number;
  @Column({ type: 'integer', nullable: true }) pointsExpirationDays: number | null;
  @Column({ default: false }) cashbackEnabled: boolean;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) cashbackPercent: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) cashbackMinimumOrderAmount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) cashbackMaximumPerOrder: number | null;
  @Column({ type: 'integer', nullable: true }) cashbackExpirationDays: number | null;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) maximumCashbackUsePercent: number;
  @Column({ type: 'varchar', default: RewardsGrantedOn.COMPLETED }) rewardsGrantedOn: RewardsGrantedOn;
}
