import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFilterEntity } from '@/src/libs/models/entities/productFilter/ProductFilter.entity';

@Injectable()
export class ProductFiltersService {
  constructor(
    @InjectRepository(ProductFilterEntity)
    private readonly productFilterRepository: Repository<ProductFilterEntity>,
  ) {}

  async getProductFiltersWithOptionsByCategory(categoryId: string) {
    const filters = await this.productFilterRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['translations', 'options', 'options.translations'],
    });

    return filters;
  }
}
