import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { Column, Entity } from 'typeorm';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRoleEnum;
}
