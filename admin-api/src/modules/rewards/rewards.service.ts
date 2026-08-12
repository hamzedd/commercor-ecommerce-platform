import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoyaltySettingsEntity } from '@/src/libs/models/entities/reward/LoyaltySettings.entity';
import { LoyaltySettingsDto } from '@/src/libs/models/dtos/rewards/LoyaltySettings.dto';
import { RewardsGrantedOn } from '@/src/utils/enums/RewardEnums';
const defaults = { pointsEnabled: false, pointsPerCurrencyUnit: 0, pointsPerCurrencyRedemptionUnit: 100, minimumPointsToRedeem: 0, maximumPointsRedemptionPercent: 0, pointsExpirationDays: null, cashbackEnabled: false, cashbackPercent: 0, cashbackMinimumOrderAmount: 0, cashbackMaximumPerOrder: null, cashbackExpirationDays: null, maximumCashbackUsePercent: 0, rewardsGrantedOn: RewardsGrantedOn.COMPLETED };
@Injectable()
export class RewardsService {
  constructor(private readonly dataSource: DataSource) {}
  async getSettings() { const row = await this.dataSource.getRepository(LoyaltySettingsEntity).findOne({ where: {} }); return this.serialize(row); }
  async updateSettings(data: LoyaltySettingsDto) { await this.dataSource.transaction(async manager => { const repo = manager.getRepository(LoyaltySettingsEntity); const current = await repo.findOne({ where: {} }); await repo.save(repo.create({ ...(current || {}), ...data })); }); return this.getSettings(); }
  private serialize(row: LoyaltySettingsEntity | null) { const v = { ...defaults, ...(row || {}) }; return { pointsEnabled: v.pointsEnabled, pointsPerCurrencyUnit: Number(v.pointsPerCurrencyUnit), pointsPerCurrencyRedemptionUnit: Number(v.pointsPerCurrencyRedemptionUnit), minimumPointsToRedeem: v.minimumPointsToRedeem, maximumPointsRedemptionPercent: Number(v.maximumPointsRedemptionPercent), pointsExpirationDays: v.pointsExpirationDays, cashbackEnabled: v.cashbackEnabled, cashbackPercent: Number(v.cashbackPercent), cashbackMinimumOrderAmount: Number(v.cashbackMinimumOrderAmount), cashbackMaximumPerOrder: v.cashbackMaximumPerOrder == null ? null : Number(v.cashbackMaximumPerOrder), cashbackExpirationDays: v.cashbackExpirationDays, maximumCashbackUsePercent: Number(v.maximumCashbackUsePercent), rewardsGrantedOn: v.rewardsGrantedOn }; }
}
