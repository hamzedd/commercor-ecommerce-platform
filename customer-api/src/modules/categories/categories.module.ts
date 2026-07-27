import { Module } from '@nestjs/common';
import { CategoriesController } from '@/src/modules/categories/controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { CategoryTranslationsEntity } from '@/src/libs/models/entities/category/CategoryTranslation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, CategoryTranslationsEntity]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
