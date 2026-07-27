import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentsController } from '@/src/modules/payments/controllers/payments.controller';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CustomerEntity, PaymentEntity]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
