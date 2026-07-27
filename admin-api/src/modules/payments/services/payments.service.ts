import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentRefundDto } from '@/src/libs/models/dtos/payments/PaymentRefund.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>,
      ) {}

      async getAllPayments(): Promise<PaymentEntity[]> {
        return await this.paymentRepository.find();
      }
    
      async getPaymentById(id: string): Promise<PaymentEntity> {
        return await this.paymentRepository.findOneOrFail({
          where: { id },
        });
      }
    
      async refundPayment(
        id: string,
        data: PaymentRefundDto,
      ): Promise<{ message: string }> {
        await this.paymentRepository.manager.transaction(async (manager) => {
          const paymentRepo = manager.getRepository(PaymentEntity);
    
          const payment = await paymentRepo.findOneOrFail({
            where: { id },
          });

            if (payment.status !== 'completed') {
                throw new BadRequestException('Only completed payments can be refunded');
            }
            if (payment.refundedAmount + data.refundedAmount > payment.totalAmount) {
                throw new BadRequestException('Refund amount exceeds original payment amount');
            }

            payment.refundedAmount += data.refundedAmount;
    
          await paymentRepo.save(payment);
        });
     
        return { message: 'Payment updated successfully' };
      }
}
