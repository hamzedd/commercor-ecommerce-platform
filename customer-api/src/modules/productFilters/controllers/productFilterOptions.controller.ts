import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ProductFiltersService } from '@/src/modules/productFilters/services/productFilterOptions.service';

@Controller('product-filters')
export class ProductFiltersController {
  constructor(private readonly productFiltersService: ProductFiltersService) {}

  @Get()
  getProductFiltersWithOptionsByCategory(
    @Query('categoryId') categoryId: string,
  ) {
    if (!categoryId) {
      throw new BadRequestException('categoryId is required');
    }
    return this.productFiltersService.getProductFiltersWithOptionsByCategory(
      categoryId,
    );
  }
}
