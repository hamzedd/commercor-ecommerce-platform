import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductFilterDto } from '@/src/libs/models/dtos/productsFilter/ProductFilter.dto';
import { ProductFilterEntity } from '@/src/libs/models/entities/productFilter/ProductFilter.entity';
import { ProductFilterTranslationsEntity } from '@/src/libs/models/entities/productFilter/ProductFilterTranslation.entity';
import { ProductFilterTypeEnum } from '@/src/utils/enums/ProductFilterEnums';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';

@Injectable()
export class ProductFiltersService {
  constructor(
    @InjectRepository(ProductFilterEntity)
    private readonly productFilterRepository: Repository<ProductFilterEntity>,
    @InjectRepository(ProductFilterTranslationsEntity)
    private readonly productFilterTranslationsEntityRepository: Repository<ProductFilterTranslationsEntity>,
  ) {}

  async createProductFilter(data: ProductFilterDto) {
    await this.productFilterRepository.manager.transaction(async (manager) => {
      const filterRepository = manager.getRepository(ProductFilterEntity);
      const categoryRepository = manager.getRepository(CategoryEntity);
      const nameExists = await filterRepository.find({
        where: {
          translations: {
            name: In(data.translations.map((translation) => translation.name)),
          },
        },
      });
      if (nameExists.length > 0) {
        throw new BadRequestException('Product filter name must be unique');
      }

      const categories = await categoryRepository.find({
        where: { id: In(data.categoryIds) },
      });
      if (categories.length !== data.categoryIds.length) {
        throw new BadRequestException(
          'One or more selected categories do not exist',
        );
      }

      const newFilter = filterRepository.create({
        type: data.type,
        translations: data.translations,
        categories,
      });
      await filterRepository.save(newFilter);
    });

    return HttpStatus.CREATED;
  }

  async getProductFilters() {
    return await this.productFilterRepository.find({
      relations: ['translations', 'categories', 'categories.translations'],
    });
  }

  async getProductFilter(id: string) {
    return await this.productFilterRepository.findOne({
      relations: ['translations', 'categories', 'categories.translations'],
      where: { id },
    });
  }

  async updateProductFilter(id: string, data: ProductFilterDto) {
    await this.productFilterRepository.manager.transaction(async (manager) => {
      const productFilterRepo = manager.getRepository(ProductFilterEntity);
      const translationRepo = manager.getRepository(
        ProductFilterTranslationsEntity,
      );
      const categoryRepo = manager.getRepository(CategoryEntity);

      const productFilter = await productFilterRepo.findOneOrFail({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      const categories = await categoryRepo.find({
        where: { id: In(data.categoryIds) },
      });
      if (categories.length !== data.categoryIds.length) {
        throw new BadRequestException(
          'One or more selected categories do not exist',
        );
      }

      productFilter.type = data.type;
      productFilter.categories = categories;

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

  async getProductFiltersWithOptions(categoryId?: string) {
    return await this.productFilterRepository.find({
      where: categoryId ? { categories: { id: categoryId } } : {},
      relations: [
        'translations',
        'options',
        'options.translations',
        'categories',
        'categories.translations',
      ],
    });
  }
}
