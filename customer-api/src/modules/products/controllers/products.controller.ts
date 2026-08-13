import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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
import { ProductReviewsService } from '../services/product-reviews.service'; import { ReviewDto } from '../dtos/review.dto'; import { AuthGuard } from '@/src/libs/guards/auth.guard'; import type { GuardedApiResponse } from '@/src/utils/types/api.type';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,private readonly reviews:ProductReviewsService) {}
  @Get('reviews/mine') @UseGuards(AuthGuard) mine(@Req()req:GuardedApiResponse){return this.reviews.mine(req.user.id)}
  @Get(':id/reviews') reviewsList(@Param('id')id:string,@Query('page')page?:string,@Query('limit')limit?:string){return this.reviews.list(id,Number(page)||1,Number(limit)||10)}
  @Get(':id/reviews/summary') reviewSummary(@Param('id')id:string){return this.reviews.summary(id)}
  @Get(':id/reviews/eligibility') @UseGuards(AuthGuard) eligibility(@Req()req:GuardedApiResponse,@Param('id')id:string){return this.reviews.eligibility(req.user.id,id)}
  @Post(':id/reviews') @UseGuards(AuthGuard) createReview(@Req()req:GuardedApiResponse,@Param('id')id:string,@Body()d:ReviewDto){return this.reviews.create(req.user.id,id,d)}
  @Put(':id/reviews/:reviewId') @UseGuards(AuthGuard) updateReview(@Req()req:GuardedApiResponse,@Param('id')id:string,@Param('reviewId')reviewId:string,@Body()d:ReviewDto){return this.reviews.update(req.user.id,id,reviewId,d)}
  @Delete(':id/reviews/:reviewId') @UseGuards(AuthGuard) deleteReview(@Req()req:GuardedApiResponse,@Param('id')id:string,@Param('reviewId')reviewId:string){return this.reviews.remove(req.user.id,id,reviewId)}

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
