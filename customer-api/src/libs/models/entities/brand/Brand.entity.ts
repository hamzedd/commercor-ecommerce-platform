import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { BrandTranslationEntity } from '@/src/libs/models/entities/brand/BrandTranslation.entity';

@Entity('brands')
export class BrandEntity extends BaseEntity {
  @Column()
  rank: number;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => BrandTranslationEntity, (translation) => translation.brand, {
    cascade: true,
  })
  translations: BrandTranslationEntity[];
}
