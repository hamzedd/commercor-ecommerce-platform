import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

@Entity('product_images')
@Index(['name'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class ProductImageEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  productId: string;

  @ManyToOne(() => ProductEntity, (product) => product.images)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
