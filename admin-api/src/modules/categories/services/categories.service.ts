import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { CategoryTranslationsEntity } from '@/src/libs/models/entities/category/CategoryTranslation.entity';
import { CategoryDto } from '@/src/libs/models/dtos/categories/Category.dto';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { FilesService } from '@/src/modules/files/services/files.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryTranslationsEntity)
    private readonly categoryTranslationRepository: Repository<CategoryTranslationsEntity>,
  ) {}

  async createCategory(data: CategoryDto) {
    const slugExists = await this.categoryTranslationRepository.findOne({
      where: { slug: In(data.translations.map((t) => t.slug)) },
    });

    if (slugExists) {
      throw new BadRequestException(
        `Slug '${slugExists.slug}' already exists in another category.`,
      );
    }

    const category = this.categoryRepository.create({
      parentId: data.parentId,
      translations: data.translations,
    });

    const uploadedFile = await this.filesService.uploadFile({
      file: data.image,
      bucketName: CommercorMinioBucketEnums.CATEGORIES,
    });

    category.image = uploadedFile.objectName;

    try {
      await this.categoryRepository.save(category);
    } catch (error) {
      await this.filesService.deleteFile({
        fileName: uploadedFile.objectName,
        bucketName: CommercorMinioBucketEnums.CATEGORIES,
      });
      throw new BadRequestException(`Error saving category: ${error.message}`);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Category created successfully',
    };
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      relations: ['translations'],
    });
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    return await this.categoryRepository.findOneOrFail({
      where: { id },
      relations: ['translations'],
    });
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    await this.categoryRepository.softDelete(id);
    this.filesService.deleteFile({
      fileName: category.image,
      bucketName: CommercorMinioBucketEnums.CATEGORIES,
    });
    return { message: 'Category deleted successfully' };
  }

  async updateCategory(
    id: string,
    data: CategoryDto,
  ): Promise<{ message: string }> {
    let uploadedFile;
    await this.categoryRepository.manager
      .transaction(async (manager) => {
        const categoryRepo = manager.getRepository(CategoryEntity);
        const translationRepo = manager.getRepository(
          CategoryTranslationsEntity,
        );

        const category = await categoryRepo.findOneOrFail({
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
        const oldImage = category.image;

        if ('parentId' in data) {
          if (data.parentId === id) {
            throw new BadRequestException(
              'A category cannot be its own parent',
            );
          }
          if (data.parentId) {
            const parent = await categoryRepo.findOne({
              where: { id: data.parentId },
            });
            if (!parent)
              throw new BadRequestException('Parent category not found');
          }
          category.parentId = data.parentId ?? null;
        }

        await translationRepo.delete({ categoryId: id });
        if (data?.image && data?.image?.originalname) {
          uploadedFile = await this.filesService.uploadFile({
            file: data.image,
            bucketName: CommercorMinioBucketEnums.CATEGORIES,
          });
          category.image = uploadedFile.objectName;
          if (oldImage) {
            await this.filesService.deleteFile({
              fileName: oldImage,
              bucketName: CommercorMinioBucketEnums.CATEGORIES,
            });
          }
        }

        category.translations = Array.isArray(data.translations)
          ? data.translations.map((t) =>
              translationRepo.create({
                ...t,
                categoryId: id,
                category,
              }),
            )
          : [];

        await categoryRepo.save(category);
      })
      .catch(async (e) => {
        if (uploadedFile?.objectName) {
          await this.filesService.deleteFile({
            fileName: uploadedFile.objectName,
            bucketName: CommercorMinioBucketEnums.CATEGORIES,
          });
        }
        throw e;
      });

    return { message: 'Category updated successfully' };
  }
}
