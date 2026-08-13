import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { ProductEntity } from './Product.entity';
import { ProductVariantOptionValueEntity } from './ProductVariantOptionValue.entity';
@Entity('product_variant_options')
@Index('UQ_variant_option_product_name', ['productId', 'name'], {
  unique: true,
})
export class ProductVariantOptionEntity extends BaseEntity {
  @Column() productId: string;
  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
  @Column({ length: 100 }) name: string;
  @Column({ type: 'integer', default: 0 }) position: number;
  @OneToMany(() => ProductVariantOptionValueEntity, (v) => v.option, {
    cascade: true,
  })
  values: ProductVariantOptionValueEntity[];
}
