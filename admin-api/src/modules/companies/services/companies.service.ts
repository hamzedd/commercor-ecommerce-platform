import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { CompanyDetailDto } from '@/src/libs/models/dtos/companies/CompanyDetail.dto';
import { FilesService } from '@/src/modules/files/services/files.service';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { StoreSettingsDto } from '@/src/libs/models/dtos/companies/StoreSettings.dto';
import { StoreSettingKey } from '@/src/utils/enums/StoreSettingsEnums';

const storeSettingFields: Record<keyof StoreSettingsDto, StoreSettingKey> = {
  storeName: StoreSettingKey.STORE_NAME,
  logo: StoreSettingKey.LOGO,
  favicon: StoreSettingKey.FAVICON,
  openGraphImage: StoreSettingKey.OPEN_GRAPH_IMAGE,
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
};

const imageKeys = new Set<StoreSettingKey>([
  StoreSettingKey.LOGO,
  StoreSettingKey.FAVICON,
  StoreSettingKey.OPEN_GRAPH_IMAGE,
]);

const storeSettingsDefaults = {
  storeName: 'Commercor',
  primaryColor: '#1c1917',
  accentColor: '#d97706',
  currencyCode: 'USD',
  defaultLocale: 'en',
};

@Injectable()
export class CompaniesService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(CompanyDetailEntity)
    private readonly companyRepository: Repository<CompanyDetailEntity>,
  ) {}

  async createCompany(data: CompanyDetailDto) {
    const uploadedFile = await this.filesService.uploadFile({
      file: data.image,
      bucketName: CommercorMinioBucketEnums.COMMERCOR,
    });

    const company = this.companyRepository.create({
      ...data,
      image: uploadedFile.objectName,
    });

    await this.companyRepository.save(company);

    return HttpStatus.CREATED;
  }

  async getCompanyDetails() {
    try {
      return await this.companyRepository.find();
    } catch {
      throw new NotFoundException(`Company not found`);
    }
  }

  async getStoreSettings() {
    const rows = await this.companyRepository.findBy({
      key: In(Object.values(StoreSettingKey)),
    });
    const byKey = new Map(rows.map((row) => [row.key, row]));
    const settings: Record<string, string | null> = Object.fromEntries(
      Object.keys(storeSettingFields).map((field) => [field, null]),
    );

    Object.assign(settings, storeSettingsDefaults);
    for (const [field, key] of Object.entries(storeSettingFields)) {
      const row = byKey.get(key);
      settings[field] = imageKeys.has(key)
        ? row?.image || settings[field]
        : row?.value || settings[field];
    }

    return settings;
  }

  async updateStoreSettings(data: StoreSettingsDto) {
    await this.companyRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(CompanyDetailEntity);

      for (const [field, value] of Object.entries(data)) {
        const key = storeSettingFields[field as keyof StoreSettingsDto];
        if (!key || value === undefined) continue;

        let row = await repository.findOneBy({ key });
        if (!row) row = repository.create({ key });

        if (imageKeys.has(key)) row.image = value;
        else row.value = value;

        await repository.save(row);
      }
    });

    return this.getStoreSettings();
  }

  async getCompanyDetail(id: string) {
    try {
      return await this.companyRepository.findOneBy({ id });
    } catch {
      throw new NotFoundException(`Company not found`);
    }
  }

  async updateCompany({ id, data }: { id: string; data: CompanyDetailDto }) {
    const companyDetail = await this.companyRepository.findOneBy({
      id,
    });

    if (!companyDetail) {
      throw new NotFoundException(`Company with ID: ${id} not found`);
    }

    let image: string;

    if (data?.image && companyDetail?.image) {
      this.filesService.deleteFile({
        bucketName: CommercorMinioBucketEnums.COMMERCOR,
        fileName: companyDetail.image,
      });
      image = (
        await this.filesService.uploadFile({
          bucketName: CommercorMinioBucketEnums.COMMERCOR,
          file: data.image,
        })
      ).objectName;
    }

    await this.companyRepository.update(id, {
      ...data,
      image: image || companyDetail?.image,
    });

    return HttpStatus.OK;
  }

  async deleteCompany(id: string) {
    const companyDetail = await this.companyRepository.findOneByOrFail({
      id,
    });

    if (!companyDetail) {
      throw new NotFoundException(`Company Detail with ID: ${id} not found`);
    }

    if (companyDetail?.image) {
      this.filesService.deleteFile({
        bucketName: CommercorMinioBucketEnums.COMMERCOR,
        fileName: companyDetail?.image,
      });
    }

    await this.companyRepository.softDelete(id);

    return HttpStatus.OK;
  }
}
