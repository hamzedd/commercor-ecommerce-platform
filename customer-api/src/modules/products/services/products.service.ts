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
import {
  ProductReviewEntity,
  ReviewStatus,
} from '@/src/libs/models/entities/review/ProductReview.entity';

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
    const result = await paginate(query, qb, getProductsPaginateConfig);
    await this.attachRatings(result.data);
    return result;
  }

  async getProductById(id: ProductEntity['id']): Promise<ProductEntity | null> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        translations: true,
        images: true,
        brand: true,
        category: true,
        variants: { values: { optionValue: { option: true } } },
      },
    });
    await this.attachRatings(product ? [product] : []);
    return this.withVariants(product) as ProductEntity | null;
  }

  async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    const product = await this.productRepository.findOne({
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
        variants: { values: { optionValue: { option: true } } },
      },
    });
    await this.attachRatings(product ? [product] : []);
    return this.withVariants(product) as ProductEntity | null;
  }
  private async attachRatings(products: ProductEntity[]) {
    if (!products.length) return;
    const rows = await this.productRepository.manager.getRepository(ProductReviewEntity).createQueryBuilder('review').select('review.productId', 'productId').addSelect('COUNT(*)', 'count').addSelect('COALESCE(AVG(review.rating),0)', 'average').where('review.productId IN (:...ids)', { ids: products.map((product) => product.id) }).andWhere('review.status = :status', { status: ReviewStatus.APPROVED }).andWhere('review.deleted_at IS NULL').groupBy('review.productId').getRawMany();
    const ratings = new Map(rows.map((row) => [row.productId, row]));
    for (const product of products) { const rating = ratings.get(product.id); Object.assign(product, { averageRating: rating ? Number(Number(rating.average).toFixed(1)) : 0, reviewCount: rating ? Number(rating.count) : 0 }); }
  }
  private withVariants(product: ProductEntity | null) {
    if (!product) return null;
    const variants = (product.variants || [])
      .filter((v) => v.enabled)
      .map((v) => {
        const options = v.values
          .map((a) => ({
            optionId: a.optionValue.optionId,
            optionName: a.optionValue.option.name,
            valueId: a.optionValue.id,
            value: a.optionValue.value,
          }))
          .sort((a, b) => a.optionName.localeCompare(b.optionName));
        return {
          id: v.id,
          sku: v.sku,
          effectivePrice: Number(v.priceOverride ?? product.price),
          stock: v.stock,
          enabled: v.enabled,
          image: v.image,
          options,
          description: options.map((o) => o.value).join(' / '),
        };
      });
    return { ...product, variants };
  }
}
