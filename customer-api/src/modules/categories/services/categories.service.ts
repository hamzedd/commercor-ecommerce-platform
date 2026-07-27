import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { CategoryTranslationsEntity } from '@/src/libs/models/entities/category/CategoryTranslation.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryTranslationsEntity)
    private readonly categoryTranslationRepository: Repository<CategoryTranslationsEntity>,
  ) {}

  async getCategories(search?: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      relations: ['translations'],

      ...(search
        ? {
            where: {
              translations: { name: Like(`%${search || ''}%`) },
            },
          }
        : {}),
    });
  }

  async getCategoryBySlug(slug: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneOrFail({
      where: {
        translations: { slug },
      },
    });

    return this.categoryRepository.findOneOrFail({
      where: { id: category.id },
      relations: {
        translations: true,
      },
    });
  }
}
