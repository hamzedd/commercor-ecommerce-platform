import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { ProductVariantOptionEntity } from './ProductVariantOption.entity';
@Entity('product_variant_option_values')
@Index('UQ_variant_option_value', ['optionId', 'value'], { unique: true })
export class ProductVariantOptionValueEntity extends BaseEntity {
  @Column() optionId: string;
  @ManyToOne(() => ProductVariantOptionEntity, (o) => o.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'optionId' })
  option: ProductVariantOptionEntity;
  @Column({ length: 100 }) value: string;
  @Column({ type: 'integer', default: 0 }) position: number;
}
