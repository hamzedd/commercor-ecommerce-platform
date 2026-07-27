import { Module } from '@nestjs/common';
import { CustomersController } from '@/src/modules/customers/controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, UserEntity])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
