import { Module } from '@nestjs/common';
import { ProductsController } from '@/src/modules/product/controllers/products.controller';
import { ProductsService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductTranslationEntity,
      ProductFilterOptionValueEntity,
      CategoryEntity,
      BrandEntity,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
