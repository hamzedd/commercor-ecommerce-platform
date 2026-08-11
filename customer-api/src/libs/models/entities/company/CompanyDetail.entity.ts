import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity('company_details')
@Index(['key'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class CompanyDetailEntity extends BaseEntity {
  @Column()
  key: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  image: string;
}
