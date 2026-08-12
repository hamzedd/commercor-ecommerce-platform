import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';

@Injectable()
export class PaymentsService {
  constructor(private readonly dataSource: DataSource) {}

  async checkPaymentStatus(paymentId: PaymentEntity['id'], customerId:string) {
    return this.dataSource.transaction(async (manager) => {
      const paymentsRepo = manager.getRepository(PaymentEntity);

      const payment = await paymentsRepo.findOneBy({ id: paymentId });

      if (!payment) {
        throw new BadRequestException('Payment does not exist');
      }
      const order=await manager.getRepository(OrderEntity).findOneBy({paymentId:payment.id,customerId});
      if(!order)throw new BadRequestException('Payment does not exist');

      return {
        status: payment.status,
        orderStatus: order.status,
        expectedAmount: Number(order.finalTotal),
        paidAmount: payment.paidAmount==null?null:Number(payment.paidAmount),
        currencyCode: payment.currencyCode,
        refundedAmount: Number(payment.refundedAmount),
      };
    });
  }
}
