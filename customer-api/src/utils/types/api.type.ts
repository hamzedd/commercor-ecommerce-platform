import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';

export type GuardedApiResponse = {
  user: CustomerEntity;
} & Request;

export type OptionallyGuardedApiResponse = {
  user?: CustomerEntity;
} & Request;
