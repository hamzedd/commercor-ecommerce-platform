import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import * as Minio from 'minio';
import dataSource from '@/src/utils/migrationDataSource';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductImageEntity } from '@/src/libs/models/entities/product/ProductImage.entity';
import { CountryLangEnum } from '@/src/utils/enums/CountryEnums';
import { CommercorMinioBucketEnums } from '@/src/utils/enums/CommercorMinioBucketEnums';
import { createMinioClient } from '@/src/modules/minio/minio.module';

type DemoCategory = {
  name: string;
  slug: string;
  description: string;
};

type DemoBrand = DemoCategory & { rank: number };

type DemoProduct = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  categorySlug: string;
  brandSlug: string;
  imageFile: string;
};

const categories: DemoCategory[] = [
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Comfortable clothing for everyday wear.',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Footwear for daily life and active movement.',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Practical accessories for everyday use.',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Modern electronics for work, activity, and entertainment.',
  },
  {
    name: 'Home',
    slug: 'home',
    description: 'Useful essentials for the home and workplace.',
  },
];

const brands: DemoBrand[] = [
  {
    name: 'Commercor',
    slug: 'commercor',
    description: 'Everyday essentials from Commercor.',
    rank: 1,
  },
  {
    name: 'UrbanFit',
    slug: 'urbanfit',
    description: 'Modern products for active urban lifestyles.',
    rank: 2,
  },
  {
    name: 'NovaTech',
    slug: 'novatech',
    description: 'Accessible technology for everyday life.',
    rank: 3,
  },
  {
    name: 'HomeCraft',
    slug: 'homecraft',
    description: 'Simple, practical products for comfortable homes.',
    rank: 4,
  },
];

const products: DemoProduct[] = [
  {
    name: 'Classic T-Shirt',
    slug: 'classic-t-shirt',
    description:
      'A comfortable everyday cotton T-shirt with a clean, modern design.',
    price: '19.99',
    stock: 50,
    categorySlug: 'clothing',
    brandSlug: 'commercor',
    imageFile: 'classic-t-shirt.jpg',
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    description:
      'Lightweight running shoes designed for everyday training and comfortable movement.',
    price: '59.99',
    stock: 30,
    categorySlug: 'shoes',
    brandSlug: 'urbanfit',
    imageFile: 'running-shoes.jpg',
  },
  {
    name: 'Leather Backpack',
    slug: 'leather-backpack',
    description:
      'A practical everyday backpack with a clean leather-inspired finish and spacious storage.',
    price: '44.99',
    stock: 20,
    categorySlug: 'accessories',
    brandSlug: 'urbanfit',
    imageFile: 'leather-backpack.jpg',
  },
  {
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description:
      'Comfortable wireless headphones with clear audio, modern styling, and everyday convenience.',
    price: '79.99',
    stock: 25,
    categorySlug: 'electronics',
    brandSlug: 'novatech',
    imageFile: 'wireless-headphones.jpg',
  },
  {
    name: 'Smart Watch',
    slug: 'smart-watch',
    description:
      'A modern smart watch for notifications, activity tracking, and everyday use.',
    price: '99.99',
    stock: 15,
    categorySlug: 'electronics',
    brandSlug: 'novatech',
    imageFile: 'smart-watch.jpg',
  },
  {
    name: 'Coffee Mug',
    slug: 'coffee-mug',
    description:
      'A simple ceramic coffee mug designed for daily use at home or work.',
    price: '12.99',
    stock: 40,
    categorySlug: 'home',
    brandSlug: 'homecraft',
    imageFile: 'coffee-mug.jpg',
  },
];

const imageDirectory = join(process.cwd(), 'demo-assets', 'products');
const productsBucket = CommercorMinioBucketEnums.PRODUCTS;

function translation(demo: DemoCategory) {
  return {
    lang: CountryLangEnum.EN,
    name: demo.name,
    description: demo.description,
    slug: demo.slug,
    metaTitle: demo.name,
    metaDescription: demo.description,
  };
}

async function loadImages(): Promise<Map<string, Buffer>> {
  const maxBytes = Number.parseInt(
    process.env.UPLOAD_MAX_BYTES || '5242880',
    10,
  );
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0)
    throw new Error('UPLOAD_MAX_BYTES must be a positive integer');

  const loaded = new Map<string, Buffer>();
  const errors: string[] = [];
  for (const product of products) {
    const path = join(imageDirectory, product.imageFile);
    try {
      const info = await stat(path);
      if (!info.isFile() || info.size === 0)
        throw new Error('must be a non-empty file');
      if (info.size > maxBytes)
        throw new Error(`exceeds the ${maxBytes}-byte upload limit`);
      const buffer = await readFile(path);
      if (
        buffer.length < 3 ||
        buffer[0] !== 0xff ||
        buffer[1] !== 0xd8 ||
        buffer[2] !== 0xff
      )
        throw new Error('is not a valid JPEG file');
      loaded.set(product.imageFile, buffer);
    } catch (error) {
      errors.push(`${path}: ${(error as Error).message}`);
    }
  }
  if (errors.length)
    throw new Error(`Demo image validation failed:\n${errors.join('\n')}`);
  return loaded;
}

async function objectExists(client: Minio.Client, name: string) {
  try {
    await client.statObject(productsBucket, name);
    return true;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'NotFound' || code === 'NoSuchKey' || code === 'NoSuchObject')
      return false;
    throw error;
  }
}

async function main() {
  const images = await loadImages();
  const storage = createMinioClient();
  if (!(await storage.bucketExists(productsBucket)))
    throw new Error(
      `Required object storage bucket "${productsBucket}" does not exist`,
    );

  await dataSource.initialize();
  const uploadedThisRun: string[] = [];
  try {
    await dataSource.transaction(async (manager) => {
      const categoryRepository = manager.getRepository(CategoryEntity);
      const brandRepository = manager.getRepository(BrandEntity);
      const productRepository = manager.getRepository(ProductEntity);
      const imageRepository = manager.getRepository(ProductImageEntity);
      const categoryIds = new Map<string, string>();
      const brandIds = new Map<string, string>();

      for (const demo of categories) {
        let entity = await categoryRepository.findOne({
          where: { translations: { slug: demo.slug } },
          relations: { translations: true },
        });
        if (!entity) {
          entity = await categoryRepository.save(
            categoryRepository.create({
              parentId: null,
              image: null,
              translations: [translation(demo)],
            }),
          );
          process.stdout.write(`Created category: ${demo.name}\n`);
        } else {
          process.stdout.write(`Reused category: ${demo.name}\n`);
        }
        categoryIds.set(demo.slug, entity.id);
      }

      for (const demo of brands) {
        let entity = await brandRepository.findOne({
          where: { translations: { slug: demo.slug } },
          relations: { translations: true },
        });
        if (!entity) {
          entity = await brandRepository.save(
            brandRepository.create({
              rank: demo.rank,
              image: null,
              translations: [translation(demo)],
            }),
          );
          process.stdout.write(`Created brand: ${demo.name}\n`);
        } else {
          process.stdout.write(`Reused brand: ${demo.name}\n`);
        }
        brandIds.set(demo.slug, entity.id);
      }

      for (const demo of products) {
        let entity = await productRepository.findOne({
          where: { translations: { slug: demo.slug } },
          relations: { translations: true, images: true },
        });
        if (!entity) {
          entity = await productRepository.save(
            productRepository.create({
              price: demo.price as unknown as number,
              stock: demo.stock,
              lowStockThreshold: null,
              categoryId: categoryIds.get(demo.categorySlug),
              brandId: brandIds.get(demo.brandSlug),
              translations: [translation(demo)],
              images: [],
            }),
          );
          process.stdout.write(`Created product: ${demo.name}\n`);
        } else {
          process.stdout.write(`Reused product: ${demo.name}\n`);
        }

        const objectName = `demo-${demo.imageFile}`;
        let image = entity.images?.find((item) => item.name === objectName);
        const stored = await objectExists(storage, objectName);
        if (!stored) {
          const buffer = images.get(demo.imageFile);
          if (!buffer)
            throw new Error(`Image was not loaded: ${demo.imageFile}`);
          await storage.putObject(
            productsBucket,
            objectName,
            buffer,
            buffer.length,
            {
              'Content-Type': 'image/jpeg',
            },
          );
          uploadedThisRun.push(objectName);
          process.stdout.write(`Uploaded image: ${demo.imageFile}\n`);
        }
        if (!image) {
          const conflictingImage = await imageRepository.findOne({
            where: { name: objectName },
          });
          if (conflictingImage && conflictingImage.productId !== entity.id)
            throw new Error(
              `Image object name "${objectName}" is already assigned to another product`,
            );
          image = await imageRepository.save(
            imageRepository.create({ productId: entity.id, name: objectName }),
          );
          process.stdout.write(`Linked image: ${demo.imageFile}\n`);
        } else {
          process.stdout.write(`Reused image: ${demo.imageFile}\n`);
        }
      }
    });
    process.stdout.write('Demo catalog seed completed successfully\n');
  } catch (error) {
    await Promise.allSettled(
      uploadedThisRun.map((name) => storage.removeObject(productsBucket, name)),
    );
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  process.stderr.write(
    `Demo catalog seed failed: ${(error as Error).message}\n`,
  );
  process.exitCode = 1;
});
