import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { CompanyUserRoleEnum } from '@/src/utils/enums/CompanyEnums';

@Entity('company_users')
export class CompanyUserEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  role: CompanyUserRoleEnum;
}
