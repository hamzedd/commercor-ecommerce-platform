import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';

@Injectable()
export class PaymentsService {
  constructor(private readonly dataSource: DataSource) {}

  async checkPaymentStatus(paymentId: PaymentEntity['id']) {
    return this.dataSource.transaction(async (manager) => {
      const paymentsRepo = manager.getRepository(PaymentEntity);

      const payment = await paymentsRepo.findOneBy({ id: paymentId });

      if (!payment) {
        throw new BadRequestException('Payment does not exist');
      }

      return {
        status: payment.status,
      };
    });
  }
}
