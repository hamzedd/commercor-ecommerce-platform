import { Module } from '@nestjs/common';
import { ProductFiltersService } from './services/productFilterOptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFiltersController } from '@/src/modules/productFilters/controllers/productFilterOptions.controller';
import { ProductFilterEntity } from '@/src/libs/models/entities/productFilter/ProductFilter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFilterEntity])],
  controllers: [ProductFiltersController],
  providers: [ProductFiltersService],
})
export class ProductFiltersModule {}
