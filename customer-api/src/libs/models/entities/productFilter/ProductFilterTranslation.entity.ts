import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductFilterEntity } from './ProductFilter.entity';

@Entity('product_filter_translations')
@Index(['name'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class ProductFilterTranslationsEntity extends BaseEntity {
  @ManyToOne(() => ProductFilterEntity, (productFilter) => productFilter.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productFilterId' })
  productFilter: ProductFilterEntity;

  @Column()
  productFilterId: string;

  @Column()
  lang: string;

  @Column()
  name: string;
}
