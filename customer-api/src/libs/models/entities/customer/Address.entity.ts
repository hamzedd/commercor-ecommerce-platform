import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';

@Entity('addresses')
export class AddressEntity extends BaseEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.id)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column()
  customerId: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  detail: string;

  @Column()
  phoneNumber: string;
}
