import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommerceSettingsEntity } from '@/src/libs/models/entities/commerce/CommerceSettings.entity';
import { CommerceCountryRuleEntity } from '@/src/libs/models/entities/commerce/CommerceCountryRule.entity';
import { CommerceSettingsDto } from '@/src/libs/models/dtos/commerce/CommerceSettings.dto';

const defaults = { shippingEnabled: false, defaultShippingFee: 0, freeShippingThreshold: null, taxEnabled: false, defaultTaxRate: 0, pricesIncludeTax: false };

@Injectable()
export class CommerceService {
  constructor(private readonly dataSource: DataSource) {}

  async getSettings() {
    const settings = await this.dataSource.getRepository(CommerceSettingsEntity).findOne({ where: {} });
    const countryRules = await this.dataSource.getRepository(CommerceCountryRuleEntity).find({ order: { countryCode: 'ASC' } });
    return {
      shippingEnabled: settings?.shippingEnabled ?? defaults.shippingEnabled,
      defaultShippingFee: Number(settings?.defaultShippingFee ?? defaults.defaultShippingFee),
      freeShippingThreshold: settings?.freeShippingThreshold == null ? null : Number(settings.freeShippingThreshold),
      taxEnabled: settings?.taxEnabled ?? defaults.taxEnabled,
      defaultTaxRate: Number(settings?.defaultTaxRate ?? defaults.defaultTaxRate),
      pricesIncludeTax: settings?.pricesIncludeTax ?? defaults.pricesIncludeTax,
      countryRules: countryRules.map(this.serializeRule),
    };
  }

  async updateSettings(data: CommerceSettingsDto) {
    await this.dataSource.transaction(async (manager) => {
      const settingsRepo = manager.getRepository(CommerceSettingsEntity);
      let settings = await settingsRepo.findOne({ where: {} });
      settings = settingsRepo.create({ ...(settings || {}), ...data });
      await settingsRepo.save(settings);
      const rulesRepo = manager.getRepository(CommerceCountryRuleEntity);
      await rulesRepo.delete({});
      if (data.countryRules.length) await rulesRepo.save(data.countryRules.map((rule) => rulesRepo.create({ ...rule, countryCode: rule.countryCode.toUpperCase() })));
    });
    return this.getSettings();
  }

  private serializeRule(rule: CommerceCountryRuleEntity) {
    return { countryCode: rule.countryCode, shippingEnabled: rule.shippingEnabled, shippingFee: rule.shippingFee === null ? null : Number(rule.shippingFee), freeShippingThreshold: rule.freeShippingThreshold === null ? null : Number(rule.freeShippingThreshold), taxEnabled: rule.taxEnabled, taxRate: rule.taxRate === null ? null : Number(rule.taxRate) };
  }
}
