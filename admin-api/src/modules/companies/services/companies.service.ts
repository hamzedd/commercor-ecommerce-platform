import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { CompanyDetailDto } from '@/src/libs/models/dtos/companies/CompanyDetail.dto';
import { FilesService } from '@/src/modules/files/services/files.service';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { StoreSettingsDto } from '@/src/libs/models/dtos/companies/StoreSettings.dto';
import {
  StoreSettingKey,
  STORE_SETTING_IMAGE_KEYS,
} from '@/src/utils/enums/StoreSettingsEnums';

const settingFields: Record<string, StoreSettingKey> = {
  storeName: StoreSettingKey.STORE_NAME,
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

const defaults = {
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
  async getStoreSettings() {
    const rows = await this.companyRepository.findBy({
      key: In(Object.values(StoreSettingKey)),
    });
    const byKey = new Map(rows.map((row) => [row.key, row]));
    const result: Record<string, string | null> = Object.fromEntries(
      [
        ...Object.keys(settingFields),
        ...Object.keys(STORE_SETTING_IMAGE_KEYS),
      ].map((field) => [field, null]),
    );
    Object.assign(result, defaults);
    for (const [field, key] of Object.entries(settingFields))
      result[field] = byKey.get(key)?.value || result[field];
    for (const [field, key] of Object.entries(STORE_SETTING_IMAGE_KEYS))
      result[field] = byKey.get(key)?.image || null;
    if (!byKey.get(StoreSettingKey.STORE_NAME)?.value) {
      result.storeName =
        byKey.get(StoreSettingKey.LOGO)?.value || result.storeName;
    }
    return result;
  }

  async updateStoreSettings(
    data: StoreSettingsDto,
    files: Record<string, Express.Multer.File[]>,
  ) {
    const existing = await this.companyRepository.findBy({
      key: In(Object.values(StoreSettingKey)),
    });
    const byKey = new Map(existing.map((row) => [row.key, row]));
    const uploaded: string[] = [];
    const oldFiles: string[] = [];
    const newImages = new Map<StoreSettingKey, string | null>();
    try {
      for (const [field, key] of Object.entries(STORE_SETTING_IMAGE_KEYS)) {
        const file = files[field]?.[0];
        const remove =
          data[
            `remove${field[0].toUpperCase()}${field.slice(
              1,
            )}` as keyof StoreSettingsDto
          ];
        if (file) {
          const saved = await this.filesService.uploadFile({
            file,
            bucketName: CommercorMinioBucketEnums.COMMERCOR,
          });
          uploaded.push(saved.objectName);
          newImages.set(key, saved.objectName);
        } else if (remove) newImages.set(key, null);
      }
      await this.companyRepository.manager.transaction(async (manager) => {
        const repo = manager.getRepository(CompanyDetailEntity);
        for (const [field, key] of Object.entries(settingFields)) {
          if (!(field in data)) continue;
          const value = data[field as keyof StoreSettingsDto] as
            | string
            | undefined;
          const row = byKey.get(key) || repo.create({ key });
          row.value = value || null;
          await repo.save(row);
        }
        for (const [key, image] of newImages) {
          const row = byKey.get(key) || repo.create({ key });
          if (row.image && row.image !== image) oldFiles.push(row.image);
          row.image = image;
          await repo.save(row);
        }
      });
    } catch (error) {
      await Promise.allSettled(
        uploaded.map((fileName) =>
          this.filesService.deleteFile({
            fileName,
            bucketName: CommercorMinioBucketEnums.COMMERCOR,
          }),
        ),
      );
      throw error;
    }
    await Promise.allSettled(
      oldFiles.map((fileName) =>
        this.filesService.deleteFile({
          fileName,
          bucketName: CommercorMinioBucketEnums.COMMERCOR,
        }),
      ),
    );
    return this.getStoreSettings();
  }
}
