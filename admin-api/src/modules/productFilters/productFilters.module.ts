import { Module } from '@nestjs/common';
import { ProductFiltersService } from './services/productFilters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFilterEntity } from '@/src/libs/models/entities/productFilter/ProductFilter.entity';
import { ProductFiltersController } from '@/src/modules/productFilters/controllers/productFilters.controller';
import { ProductFilterOptionsController } from '@/src/modules/productFilters/controllers/productFilterOptions.controller';
import { ProductFilterOptionsService } from '@/src/modules/productFilters/services/productFilterOptions.service';
import { ProductFilterTranslationsEntity } from '@/src/libs/models/entities/productFilter/ProductFilterTranslation.entity';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';
import { ProductFilterOptionTranslationEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionTranslation.entity';
import { ProductFilterOptionValuesController } from '@/src/modules/productFilters/controllers/productFilterOptionValues.controller';
import { ProductFilterOptionValuesService } from '@/src/modules/productFilters/services/productFilterOptionValues.service';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';

@Module({
  imports: [
    JwtModule.register({ secret: JWT_SECRET }),
    TypeOrmModule.forFeature([
      ProductFilterEntity,
      ProductFilterTranslationsEntity,
      ProductFilterOptionEntity,
      ProductFilterOptionTranslationEntity,
      ProductEntity,
      ProductTranslationEntity,
      ProductFilterOptionValueEntity,
      CategoryEntity,
      UserEntity,
    ]),
  ],
  controllers: [
    ProductFiltersController,
    ProductFilterOptionsController,
    ProductFilterOptionValuesController,
  ],
  providers: [
    ProductFiltersService,
    ProductFilterOptionsService,
    ProductFilterOptionValuesService,
    AuthGuard,
    RoleGuard,
  ],
})
export class ProductFiltersModule {}
