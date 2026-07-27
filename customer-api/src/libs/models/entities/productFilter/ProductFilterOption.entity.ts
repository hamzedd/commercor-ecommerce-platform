import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductFilterEntity } from './ProductFilter.entity';
import { ProductFilterOptionTranslationEntity } from './ProductFilterOptionTranslation.entity';

@Entity('product_filter_options')
export class ProductFilterOptionEntity extends BaseEntity {
  @ManyToOne(() => ProductFilterEntity, (productFilter) => productFilter.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productFilterId' })
  productFilter: ProductFilterEntity;

  @Column()
  productFilterId: string;

  @OneToMany(
    () => ProductFilterOptionTranslationEntity,
    (translation) => translation.productFilterOption,
    { cascade: true },
  )
  translations: ProductFilterOptionTranslationEntity[];
}
