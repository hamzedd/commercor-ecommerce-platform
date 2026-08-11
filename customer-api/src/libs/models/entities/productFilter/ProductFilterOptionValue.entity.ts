import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity('product_filter_option_values')
@Index('unique_product_filter_value', ['productFilterOptionId', 'productId'], {
  unique: true,
})
export class ProductFilterOptionValueEntity extends BaseEntity {
  @Column()
  productFilterId: string;

  @Column()
  productFilterOptionId: string;

  @Index()
  @Column()
  productId: string;
}
