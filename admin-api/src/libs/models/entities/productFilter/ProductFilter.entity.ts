import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  RelationId,
} from 'typeorm';
import { ProductFilterTranslationsEntity } from '@/src/libs/models/entities/productFilter/ProductFilterTranslation.entity';
import { ProductFilterTypeEnum } from '@/src/utils/enums/ProductFilterEnums';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';
import { CategoryEntity } from '@/src/libs/models/entities/category/Category.entity';

@Entity('product_filters')
export class ProductFilterEntity extends BaseEntity {
  @Column()
  type: ProductFilterTypeEnum;

  @OneToMany(
    () => ProductFilterTranslationsEntity,
    (translation) => translation.productFilter,
    { cascade: true },
  )
  translations: ProductFilterTranslationsEntity[];

  @OneToMany(
    () => ProductFilterOptionEntity,
    (option) => option.productFilter,
    { cascade: true },
  )
  options: ProductFilterOptionEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.productFilters)
  @JoinTable({
    name: 'product_filter_categories',
    joinColumn: { name: 'productFilterId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @RelationId((productFilter: ProductFilterEntity) => productFilter.categories)
  categoryIds: string[];
}
