import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { getProductsPaginateConfig } from '@/src/utils/paginateConfigs/productPaginateConfigs';
import { SearchProductsDto } from '@/src/libs/models/dtos/products/SearchProducts.dto';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductTranslationEntity)
    private readonly productTranslationRepository: Repository<ProductTranslationEntity>,
    @InjectRepository(ProductFilterOptionValueEntity)
    private readonly productFilterOptionValueRepository: Repository<ProductFilterOptionValueEntity>,
    @InjectRepository(ProductFilterOptionEntity)
    private readonly productFilterOptionRepository: Repository<ProductFilterOptionEntity>,
  ) {}

  async getProducts({
    query,
    data,
  }: {
    query: PaginateQuery;
    data: SearchProductsDto;
  }): Promise<Paginated<ProductEntity>> {
    const qb = this.productRepository.createQueryBuilder('product');

    if (data?.productFilterValues?.length) {
      const filterOptions = await this.productFilterOptionRepository.find({
        where: {
          id: In(data.productFilterValues),
        },
        relations: ['productFilter'],
      });

      const filterGroups = new Map<string, string[]>();
      filterOptions.forEach((option) => {
        const filterId = option.productFilter.id;
        if (!filterGroups.has(filterId)) {
          filterGroups.set(filterId, []);
        }
        filterGroups.get(filterId)!.push(option.id);
      });

      const productSetsByFilter: Set<string>[] = [];

      for (const [, optionIds] of filterGroups) {
        const productsForFilter =
          await this.productFilterOptionValueRepository.find({
            where: {
              productFilterOptionId: In(optionIds),
            },
            select: ['productId'],
          });

        const productSet = new Set(
          productsForFilter.map((item) => item.productId),
        );
        productSetsByFilter.push(productSet);
      }

      if (productSetsByFilter.length > 0) {
        const validProductIds = Array.from(productSetsByFilter[0]).filter(
          (productId) => productSetsByFilter.every((set) => set.has(productId)),
        );

        if (validProductIds.length > 0) {
          qb.whereInIds(validProductIds);
        } else {
          qb.where('1=0');
        }
      }
    }
    return paginate(query, qb, getProductsPaginateConfig);
  }

  async getProductById(id: ProductEntity['id']): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: {
        translations: true,
        images: true,
        brand: true,
        category: true,
      },
    });
  }

  async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    return this.productRepository.findOne({
      where: {
        translations: {
          slug,
        },
      },
      relations: {
        translations: true,
        images: true,
        brand: true,
        category: true,
      },
    });
  }
}
