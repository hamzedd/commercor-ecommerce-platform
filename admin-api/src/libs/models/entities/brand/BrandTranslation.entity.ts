import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { BrandEntity } from '@/src/libs/models/entities/brand/Brand.entity';

@Entity('brand_translations')
@Index('unique_name_not_deleted', ['name'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('unique_slug_not_deleted', ['slug'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class BrandTranslationEntity extends BaseEntity {
  @ManyToOne(() => BrandEntity, (brand) => brand.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @Column()
  brandId: string;

  @Column()
  lang: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column()
  metaTitle: string;

  @Column()
  metaDescription: string;
}
