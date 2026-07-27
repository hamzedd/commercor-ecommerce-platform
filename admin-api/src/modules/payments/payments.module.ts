import { Module } from '@nestjs/common';
import {PaymentsController } from '@/src/modules/payments/controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
