import { Module } from '@nestjs/common';
import {PaymentsController } from '@/src/modules/payments/controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerRewardAccountEntity } from '@/src/libs/models/entities/reward/CustomerRewardAccount.entity';
import { RewardTransactionEntity } from '@/src/libs/models/entities/reward/RewardTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, OrderEntity, CustomerRewardAccountEntity, RewardTransactionEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
