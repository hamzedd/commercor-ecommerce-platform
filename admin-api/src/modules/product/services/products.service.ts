import { ProductDto } from '@/src/libs/models/dtos/products/Product.dto';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { FilesService } from '@/src/modules/files/services/files.service';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { ProductImageEntity } from '@/src/libs/models/entities/product/ProductImage.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductTranslationEntity)
    private readonly productTranslationRepository: Repository<ProductTranslationEntity>,
    @InjectRepository(ProductFilterOptionValueEntity)
    private readonly productFilterOptionValuesRepository: Repository<ProductFilterOptionValueEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async createProduct(data: ProductDto) {
    const slugExists = await this.productRepository.find({
      where: {
        translations: {
          slug: In(data.translations.map((t) => t.slug)),
        },
      },
    });

    if (slugExists.length > 0) {
      throw new NotFoundException(`The slug already exists.`);
    }

    const brandExists = await this.brandRepository.findOne({
      where: { id: data.brandId },
    });

    if (!brandExists) {
      throw new NotFoundException(`Brand with ID: ${data.brandId} not found`);
    }

    const categoryExists = await this.categoryRepository.findOne({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(
        `Category with ID: ${data.categoryId} not found`,
      );
    }

    const product = this.productRepository.create({
      ...data,
      brand: brandExists,
      category: categoryExists,
      images: [],
    });

    const uploadedFiles = await this.filesService.uploadFiles({
      files: data.images,
      bucketName: CommercorMinioBucketEnums.PRODUCTS,
    });

    product.images = uploadedFiles.map((file) => {
      const image = new ProductImageEntity();
      image.product = product;
      image.name = file.objectName;
      return image;
    });

    try {
      await this.productRepository.save(product);
    } catch (error) {
      await this.filesService.deleteFiles({
        fileNames: uploadedFiles.map((f) => f.objectName),
        bucketName: CommercorMinioBucketEnums.PRODUCTS,
      });
      throw new NotFoundException(`Error saving product: ${error.message}`);
    }

    return HttpStatus.CREATED;
  }

  async getProducts() {
    return this.productRepository.find({
      relations: ['translations', 'images'],
    });
  }

  async getProduct(id: string) {
    try {
      return await this.productRepository.findOneOrFail({
        where: { id },
        relations: ['translations', 'images'],
      });
    } catch {
      throw new NotFoundException(`Product with ID: ${id} not found`);
    }
  }

  async updateProduct({ id, data }: { id: string; data: ProductDto }) {
    let uploadedFiles = [];

    await this.productRepository.manager
      .transaction(async (manager) => {
        const productRepo = manager.getRepository(ProductEntity);
        const translationRepo = manager.getRepository(ProductTranslationEntity);
        const productImagesRepo = manager.getRepository(ProductImageEntity);
        const oldImages = await productImagesRepo.find({
          where: { productId: id },
        });

        const product = await productRepo.findOneOrFail({
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });

        Object.keys(data).forEach((key) => {
          if (key !== 'translations') {
            product[key] = data[key];
          }
        });

        await translationRepo.delete({ productId: id });
        if (data?.images?.length) {
          await productImagesRepo.delete({ productId: id });
          uploadedFiles = await this.filesService.uploadFiles({
            files: data.images,
            bucketName: CommercorMinioBucketEnums.PRODUCTS,
          });
          this.filesService.deleteFiles({
            fileNames: oldImages.map((img) => img.id),
            bucketName: CommercorMinioBucketEnums.PRODUCTS,
          });
        } else {
          product.images = oldImages;
        }

        product.translations = Array.isArray(data.translations)
          ? data.translations.map((t) =>
              translationRepo.create({
                ...t,
                productId: id,
                product,
              }),
            )
          : [];

        if (uploadedFiles?.length) {
          product.images = uploadedFiles.map((file) => {
            const image = new ProductImageEntity();
            image.product = product;
            image.name = file.objectName;
            return image;
          });
        }
        await productRepo.save(product);
      })
      .catch((e) => {
        this.filesService.deleteFiles({
          fileNames: uploadedFiles.map((f) => f.objectName),
          bucketName: CommercorMinioBucketEnums.PRODUCTS,
        });
        throw e;
      });

    return { message: 'Product updated successfully' };
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID: ${id} not found`);
    }

    await this.productRepository.softDelete(id);
    await this.productTranslationRepository.softDelete({
      productId: id,
    });

    this.filesService.deleteFiles({
      fileNames: product.images.map((img) => img.id),
      bucketName: CommercorMinioBucketEnums.PRODUCTS,
    });

    return HttpStatus.OK;
  }

  async getProductFilterValues(id: string) {
    return await this.productFilterOptionValuesRepository.find({
      where: { productId: id },
    });
  }
}
