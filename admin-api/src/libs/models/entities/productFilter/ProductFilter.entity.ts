import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductFilterTranslationsEntity } from '@/src/libs/models/entities/productFilter/ProductFilterTranslation.entity';
import { ProductFilterTypeEnum } from '@/src/utils/enums/ProductFilterEnums';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';

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
}
