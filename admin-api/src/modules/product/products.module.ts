import { Module } from '@nestjs/common';
import { ProductsController } from '@/src/modules/product/controllers/products.controller';
import { ProductsService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';
import { ProductVariantsService } from './services/product-variants.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';

@Module({
  imports: [
    JwtModule.register({ secret: JWT_SECRET }),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductTranslationEntity,
      ProductFilterOptionValueEntity,
      CategoryEntity,
      BrandEntity,
      UserEntity,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductVariantsService, AuthGuard, RoleGuard],
})
export class ProductsModule {}
