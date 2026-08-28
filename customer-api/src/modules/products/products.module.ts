import { Module } from '@nestjs/common';
import { ProductsController } from '@/src/modules/products/controllers/products.controller';
import { ProductsService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';
import {ProductReviewEntity}from'@/src/libs/models/entities/review/ProductReview.entity';import{CustomerEntity}from'@/src/libs/models/entities/customer/Customer.entity';import{ProductReviewsService}from'./services/product-reviews.service';import{AuthGuard}from'@/src/libs/guards/auth.guard';import{JwtModule}from'@nestjs/jwt';import{JWT_SECRET}from'@/src/utils/environmentConstants';

@Module({
  imports: [
    JwtModule.register({secret:JWT_SECRET}),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductTranslationEntity,
      ProductFilterOptionValueEntity,
      ProductFilterOptionEntity,
      ProductReviewEntity,CustomerEntity,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService,ProductReviewsService,AuthGuard],
  exports: [ProductsService],
})
export class ProductsModule {}
