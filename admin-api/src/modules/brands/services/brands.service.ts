import { BrandDto } from '@/src/libs/models/dtos/brands/Brand.dto';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FilesService } from '@/src/modules/files/services/files.service';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { BrandTranslationEntity } from '@/src/libs/models/entities/brand/BrandTranslation.entity';

@Injectable()
export class BrandsService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    @InjectRepository(BrandTranslationEntity)
    private readonly brandTranslationRepository: Repository<BrandTranslationEntity>,
  ) {}

  async createBrand(data: BrandDto) {
    const slugs = data.translations.map((t) => t.slug);
    const names = data.translations.map((t) => t.name);

    const existingSlug = await this.brandTranslationRepository.findOne({
      where: { slug: In(slugs) },
    });

    if (existingSlug) {
      throw new BadRequestException(
        `The slug '${existingSlug.slug}' already exists.`,
      );
    }

    const existingName = await this.brandTranslationRepository.findOne({
      where: { name: In(names) },
    });

    if (existingName) {
      throw new BadRequestException(
        `The name '${existingName.name}' already exists.`,
      );
    }

    const uploadedFile = await this.filesService.uploadFile({
      file: data.image,
      bucketName: CommercorMinioBucketEnums.BRANDS,
    });

    const brand = this.brandRepository.create({
      ...data,
      image: uploadedFile.objectName,
    });

    try {
      await this.brandRepository.save(brand);
    } catch (error) {
      await this.filesService.deleteFile({
        fileName: uploadedFile.objectName,
        bucketName: CommercorMinioBucketEnums.CATEGORIES,
      });
      throw new BadRequestException(`Error saving brand: ${error.message}`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Category created successfully',
    };
  }

  async getBrands(): Promise<BrandEntity[]> {
    return this.brandRepository.find({
      relations: ['translations'],
    });
  }

  async getBrand(id: string): Promise<BrandEntity> {
    try {
      return await this.brandRepository.findOne({
        where: { id },
        relations: ['translations'],
      });
    } catch {
      throw new NotFoundException(`Brand with ID: ${id} not found`);
    }
  }

  async updateBrand(id: string, data: BrandDto): Promise<{ message: string }> {
    {
      let uploadedFile;
      const newImageProvided = data?.image && data?.image?.originalname;

      await this.brandRepository.manager
        .transaction(async (manager) => {
          const brandRepo = manager.getRepository(BrandEntity);
          const translationRepo = manager.getRepository(BrandTranslationEntity);

          const brand = await brandRepo.findOneOrFail({
            where: { id },
            lock: { mode: 'pessimistic_write' },
          });
          const oldImage = brand.image;

          await translationRepo.delete({ brandId: id });
          if (newImageProvided) {
            uploadedFile = await this.filesService.uploadFile({
              file: data.image,
              bucketName: CommercorMinioBucketEnums.BRANDS,
            });
            brand.image = uploadedFile.objectName;
          }

          brand.translations = Array.isArray(data.translations)
            ? data.translations.map((t) =>
                translationRepo.create({
                  ...t,
                  brandId: id,
                  brand,
                }),
              )
            : [];

          brand.rank = data.rank;
          await brandRepo.save(brand);
          if (newImageProvided) {
            this.filesService.deleteFile({
              fileName: oldImage,
              bucketName: CommercorMinioBucketEnums.BRANDS,
            });
          }
        })
        .catch((e) => {
          if (newImageProvided && uploadedFile) {
            this.filesService.deleteFiles({
              fileNames: uploadedFile.objectName,
              bucketName: CommercorMinioBucketEnums.BRANDS,
            });
          }
          throw e;
        });

      return { message: 'Brand updated successfully' };
    }
  }

  async deleteBrand(id: string): Promise<{ message: string }> {
    const brand = await this.brandRepository.findOneBy({
      id,
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID: ${id} not found`);
    }

    await this.brandRepository.softDelete(id);
    await this.brandTranslationRepository.softDelete({
      brandId: id,
    });
    this.filesService.deleteFile({
      fileName: brand.image,
      bucketName: CommercorMinioBucketEnums.BRANDS,
    });
    return { message: 'Brand deleted successfully' };
  }
}
