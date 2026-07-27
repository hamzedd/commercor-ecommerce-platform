import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { ProductTranslationEntity } from '@/src/libs/models/entities/product/ProductTranslation.entity';
import { ProductImageEntity } from '@/src/libs/models/entities/product/ProductImage.entity';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column()
  stock: number;

  @OneToMany(
    () => ProductTranslationEntity,
    (translation) => translation.product,
    { cascade: true },
  )
  translations: ProductTranslationEntity[];

  @OneToMany(() => ProductImageEntity, (image) => image.product, {
    cascade: true,
  })
  images: ProductImageEntity[];

  @ManyToOne(() => BrandEntity, (brand) => brand.id)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @Column({
    nullable: true,
  })
  brandId: BrandEntity['id'];

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column({
    nullable: true,
  })
  categoryId: CategoryEntity['id'];
}
