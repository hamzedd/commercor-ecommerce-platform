import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';

@Entity('customers')
@Index('unique_username_not_deleted', ['username'], { unique: true, where: '"deleted_at" IS NULL' })
@Index('unique_email_not_deleted', ['email'], { unique: true, where: '"deleted_at" IS NULL' })
export class CustomerEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
}