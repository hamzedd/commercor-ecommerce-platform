import { Module } from '@nestjs/common';
import { BrandsController } from '@/src/modules/brands/controllers/brands.controller';
import { BrandsService } from './services/brands.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { BrandTranslationEntity } from '@/src/libs/models/entities/brand/BrandTranslation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity, BrandTranslationEntity])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
