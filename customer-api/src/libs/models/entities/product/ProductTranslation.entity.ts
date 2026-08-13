import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

@Entity('product_translations')
@Index(['slug'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class ProductTranslationEntity extends BaseEntity {
  @ManyToOne(() => ProductEntity, (Product) => Product.translations)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column()
  productId: string;

  @Column()
  lang: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column()
  metaTitle: string;

  @Column()
  metaDescription: string;
}
