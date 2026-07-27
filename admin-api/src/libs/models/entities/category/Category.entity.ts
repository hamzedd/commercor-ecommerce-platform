import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { CategoryTranslationsEntity } from '@/src/libs/models/entities/category/CategoryTranslation.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ nullable: true })
  parentId: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(
    () => CategoryTranslationsEntity,
    (translation) => translation.category,
    { cascade: true },
  )
  translations: CategoryTranslationsEntity[];
}
