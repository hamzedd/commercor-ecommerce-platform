import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductFilterEntity } from '@/src/libs/models/entities/productFilter/ProductFilter.entity';

@Injectable()
export class ProductFiltersService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductFilterEntity)
    private readonly productFilterRepository: Repository<ProductFilterEntity>,
  ) {}

  async getProductFiltersWithOptionsByCategory(categoryId: string) {
    const products = await this.productRepository.find({
      where: { categoryId },
      select: ['id'],
    });

    if (!products.length) return [];

    const filters = await this.productFilterRepository.find({
      relations: ['translations', 'options', 'options.translations'],
    });

    return filters;
  }
}
