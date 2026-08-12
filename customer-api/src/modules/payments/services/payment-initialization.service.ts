import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { DOMAIN_URL } from '@/src/utils/environmentConstants';
import { PaymentProviderRegistry } from '../providers/payment-provider.registry';

@Injectable()
export class PaymentInitializationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly providers: PaymentProviderRegistry,
  ) {}

  async initialize(paymentId: string, customerId: string) {
    return this.dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({
        where: { id: paymentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment) throw new BadRequestException('Payment does not exist');

      const order = await manager.getRepository(OrderEntity).findOne({
        where: { paymentId: payment.id, customerId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) throw new BadRequestException('Payment does not exist');
      if (payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestException(
          'Only pending payments can be initialized',
        );
      }
      if (payment.expiresAt && payment.expiresAt.getTime() <= Date.now()) {
        throw new BadRequestException('Payment has expired');
      }

      const amount = Number(order.finalTotal);
      if (Number(payment.totalAmount) !== amount) {
        throw new BadRequestException(
          'Persisted payment amount does not match order final total',
        );
      }
      if (!payment.currencyCode) {
        throw new BadRequestException('Payment currency is missing');
      }

      return this.providers.getConfiguredProvider().createPayment({
        paymentId: payment.id,
        orderId: order.id,
        customerId,
        amount,
        currencyCode: payment.currencyCode.toUpperCase(),
        returnUrl: `${DOMAIN_URL}/payment-status/${payment.id}`,
        idempotencyKey: `payment:${payment.id}:initialize`,
      });
    });
  }
}
