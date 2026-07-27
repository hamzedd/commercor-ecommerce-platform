import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductFilterDto } from '@/src/libs/models/dtos/productsFilter/ProductFilter.dto';
import { ProductFilterEntity } from '@/src/libs/models/entities/productFilter/ProductFilter.entity';
import { ProductFilterTranslationsEntity } from '@/src/libs/models/entities/productFilter/ProductFilterTranslation.entity';
import { ProductFilterTypeEnum } from '@/src/utils/enums/ProductFilterEnums';

@Injectable()
export class ProductFiltersService {
  constructor(
    @InjectRepository(ProductFilterEntity)
    private readonly productFilterRepository: Repository<ProductFilterEntity>,
    @InjectRepository(ProductFilterTranslationsEntity)
    private readonly productFilterTranslationsEntityRepository: Repository<ProductFilterTranslationsEntity>,
  ) {}

  async createProductFilter(data: ProductFilterDto) {
    const nameExists = await this.productFilterRepository.find({
      where: {
        translations: {
          name: In(data.translations.map((t) => t.name)),
        },
      },
    });
    if (nameExists.length > 0) {
      throw new BadRequestException('Product filter name must be unique');
    }
    const newFilter = this.productFilterRepository.create(data);

    await this.productFilterRepository.save(newFilter);

    return HttpStatus.CREATED;
  }

  async getProductFilters() {
    return await this.productFilterRepository.find({
      relations: ['translations'],
    });
  }

  async getProductFilter(id: string) {
    return await this.productFilterRepository.findOne({
      relations: ['translations'],
      where: { id },
    });
  }

  async updateProductFilter(id: string, data: ProductFilterDto) {
    await this.productFilterRepository.manager.transaction(async (manager) => {
      const productFilterRepo = manager.getRepository(ProductFilterEntity);
      const translationRepo = manager.getRepository(
        ProductFilterTranslationsEntity,
      );

      const productFilter = await productFilterRepo.findOneOrFail({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      Object.keys(data).forEach((key) => {
        if (key !== 'translations') {
          productFilter[key] = data[key];
        }
      });

      await translationRepo.delete({ productFilterId: id });

      productFilter.translations = Array.isArray(data.translations)
        ? data.translations.map((t) =>
            translationRepo.create({
              ...t,
              productFilterId: id,
              productFilter,
            }),
          )
        : [];

      await productFilterRepo.save(productFilter);
    });

    return { message: 'Product Filter updated successfully' };
  }

  async deleteProductFilter(id: string) {
    await this.productFilterRepository.softDelete(id);
    await this.productFilterTranslationsEntityRepository.softDelete({
      productFilterId: id,
    });
    return { message: 'Product Filter deleted successfully' };
  }

  async getProductFilterTypes() {
    return Object.keys(ProductFilterTypeEnum).map((key) => ({
      key,
      value: ProductFilterTypeEnum[key as keyof typeof ProductFilterTypeEnum],
    }));
  }

  async getProductFiltersWithOptions() {
    return await this.productFilterRepository.find({
      relations: ['translations', 'options', 'options.translations'],
    });
  }
}
