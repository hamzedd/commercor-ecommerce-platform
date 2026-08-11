import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductFilterOptionEntity } from './ProductFilterOption.entity';

@Entity('product_filter_option_translations')
@Index(['name'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class ProductFilterOptionTranslationEntity extends BaseEntity {
  @ManyToOne(
    () => ProductFilterOptionEntity,
    (productFilterOption) => productFilterOption.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'productFilterOptionId' })
  productFilterOption: ProductFilterOptionEntity;

  @Column()
  productFilterOptionId: string;

  @Column()
  lang: string;

  @Column()
  name: string;
}
