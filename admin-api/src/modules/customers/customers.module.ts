import { Module } from '@nestjs/common';
import { CustomersController } from '@/src/modules/customers/controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import{JwtModule}from'@nestjs/jwt';import{JWT_SECRET}from'@/src/utils/environmentConstants';import{AuthGuard}from'@/src/libs/guards/auth.guard';import{RoleGuard}from'@/src/libs/guards/role.guard';import{CustomerCrmService}from'./services/customer-crm.service';import{CustomerTagsController}from'./controllers/customer-tags.controller';import{CustomerCrmProfileEntity}from'@/src/libs/models/entities/crm/CustomerCrmProfile.entity';import{CustomerTagEntity}from'@/src/libs/models/entities/crm/CustomerTag.entity';import{CustomerTagAssignmentEntity}from'@/src/libs/models/entities/crm/CustomerTagAssignment.entity';import{CustomerCrmNoteEntity}from'@/src/libs/models/entities/crm/CustomerCrmNote.entity';

@Module({
  imports: [JwtModule.register({secret:JWT_SECRET}),TypeOrmModule.forFeature([CustomerEntity, UserEntity,CustomerCrmProfileEntity,CustomerTagEntity,CustomerTagAssignmentEntity,CustomerCrmNoteEntity])],
  controllers: [CustomersController,CustomerTagsController],
  providers: [CustomersService,CustomerCrmService,AuthGuard,RoleGuard],
  exports: [CustomersService],
})
export class CustomersModule {}
