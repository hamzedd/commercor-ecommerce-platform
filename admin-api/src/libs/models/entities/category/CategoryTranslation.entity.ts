import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { CategoryEntity } from './Category.entity';

@Entity('category_translations')
export class CategoryTranslationsEntity extends BaseEntity {
  @ManyToOne(() => CategoryEntity, (category) => category.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column()
  categoryId: string;

  @Column()
  lang: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  metaTitle: string;

  @Column()
  metaDescription: string;
}
