import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { BrandTranslationEntity } from '@/src/libs/models/entities/brand/BrandTranslation.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    @InjectRepository(BrandTranslationEntity)
    private readonly brandTranslationRepository: Repository<BrandTranslationEntity>,
  ) {}

  async getBrands(
    search?: string,
    lang?: string,
  ): Promise<BrandTranslationEntity[]> {
    const query = this.brandTranslationRepository
      .createQueryBuilder('translation')
      .leftJoinAndSelect('translation.brand', 'brand')
      .select([
        'translation.id',
        'translation.name',
        'translation.description',
        'brand.id',
        'brand.image',
      ]);

    if (lang) {
      query.andWhere('translation.lang = :lang', { lang });
    }

    if (search) {
      query.andWhere('translation.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return query.orderBy('brand.created_at', 'DESC').getMany();
  }
}
