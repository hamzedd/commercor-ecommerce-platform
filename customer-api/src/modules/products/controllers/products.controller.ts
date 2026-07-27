import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from '@/src/modules/products/services/products.service';
import {
  ApiPaginationQuery,
  Paginate,
  Paginated,
  type PaginateQuery,
} from 'nestjs-paginate';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { getProductsPaginateConfig } from '@/src/utils/paginateConfigs/productPaginateConfigs';
import { SearchProductsDto } from '@/src/libs/models/dtos/products/SearchProducts.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiPaginationQuery(getProductsPaginateConfig)
  async getProducts(
    @Paginate() query: PaginateQuery,
    @Body() data: SearchProductsDto,
  ): Promise<Paginated<ProductEntity>> {
    return this.productsService.getProducts({ query, data });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductEntity | null> {
    return this.productsService.getProductById(id);
  }

  @Get('slug/:slug')
  async getProductBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductEntity | null> {
    return this.productsService.getProductBySlug(slug);
  }
}
