import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { ProductEntity } from './Product.entity';
import { ProductVariantValueEntity } from './ProductVariantValue.entity';
@Entity('product_variants')
@Index('UQ_product_variant_sku', ['sku'], {
  unique: true,
  where: '"sku" IS NOT NULL',
})
@Index('UQ_product_variant_combination', ['productId', 'combinationKey'], {
  unique: true,
})
@Check('CHK_variant_stock', '"stock" >= 0')
@Check('CHK_variant_price', '"priceOverride" IS NULL OR "priceOverride" > 0')
export class ProductVariantEntity extends BaseEntity {
  @Column() productId: string;
  @ManyToOne(() => ProductEntity, (p) => p.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
  @Column({ type: 'varchar', nullable: true, length: 100 }) sku: string | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  priceOverride: number | null;
  @Column({ type: 'integer', default: 0 }) stock: number;
  @Column({ type: 'integer', nullable: true }) lowStockThreshold: number | null;
  @Column({ default: true }) enabled: boolean;
  @Column({ type: 'varchar', nullable: true }) image: string | null;
  @Column({ length: 1000 }) combinationKey: string;
  @OneToMany(() => ProductVariantValueEntity, (v) => v.variant, {
    cascade: true,
  })
  values: ProductVariantValueEntity[];
}
