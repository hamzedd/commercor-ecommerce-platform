import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { StoreSettingKey } from '@/src/utils/enums/StoreSettingsEnums';

const publicFields: Record<string, StoreSettingKey> = {
  storeName: StoreSettingKey.STORE_NAME,
  logo: StoreSettingKey.LOGO,
  favicon: StoreSettingKey.FAVICON,
  contactEmail: StoreSettingKey.CONTACT_EMAIL,
  phone: StoreSettingKey.PHONE,
  address: StoreSettingKey.ADDRESS,
  facebookUrl: StoreSettingKey.FACEBOOK_URL,
  instagramUrl: StoreSettingKey.INSTAGRAM_URL,
  twitterUrl: StoreSettingKey.TWITTER_URL,
  linkedinUrl: StoreSettingKey.LINKEDIN_URL,
  youtubeUrl: StoreSettingKey.YOUTUBE_URL,
  primaryColor: StoreSettingKey.PRIMARY_COLOR,
  accentColor: StoreSettingKey.ACCENT_COLOR,
  currencyCode: StoreSettingKey.CURRENCY_CODE,
  defaultLocale: StoreSettingKey.DEFAULT_LOCALE,
  homeMetaTitle: StoreSettingKey.HOME_META_TITLE,
  homeMetaDescription: StoreSettingKey.HOME_META_DESCRIPTION,
  openGraphImage: StoreSettingKey.OPEN_GRAPH_IMAGE,
};
const imageKeys = new Set([
  StoreSettingKey.LOGO,
  StoreSettingKey.FAVICON,
  StoreSettingKey.OPEN_GRAPH_IMAGE,
]);

@Injectable()
export class CompanyDetailsService {
  constructor(
    @InjectRepository(CompanyDetailEntity)
    private readonly companyDetailsRepository: Repository<CompanyDetailEntity>,
  ) {}

  getCompanyDetails() {
    return this.companyDetailsRepository.find();
  }

  getCompanyDetailByKey(key: string) {
    return this.companyDetailsRepository.findOneBy({
      key,
    });
  }
  async getPublicStoreSettings() {
    const rows = await this.companyDetailsRepository.findBy({
      key: In(Object.values(StoreSettingKey)),
    });
    const byKey = new Map(rows.map((row) => [row.key, row]));
    const result: Record<string, string | null> = Object.fromEntries(
      Object.keys(publicFields).map((field) => [field, null]),
    );
    Object.assign(result, {
      storeName: 'Commercor',
      primaryColor: '#1c1917',
      accentColor: '#d97706',
      currencyCode: 'USD',
      defaultLocale: 'en',
    });
    for (const [field, key] of Object.entries(publicFields)) {
      const row = byKey.get(key);
      result[field] = imageKeys.has(key)
        ? row?.image || null
        : row?.value || result[field];
    }
    if (!byKey.get(StoreSettingKey.STORE_NAME)?.value) {
      result.storeName =
        byKey.get(StoreSettingKey.LOGO)?.value || result.storeName;
    }
    return result;
  }
}
