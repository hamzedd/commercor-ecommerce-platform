import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { DOMAIN_URL } from '@/src/utils/environmentConstants';
import { PaymentProviderRegistry } from '../providers/payment-provider.registry';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '../providers/manual.provider';
import { CartService } from '@/src/modules/cart/cart.service';

@Injectable()
export class PaymentInitializationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly providers: PaymentProviderRegistry,
    private readonly carts: CartService,
  ) {}

  async initialize(paymentId: string, customerId: string) {
    const input = await this.dataSource.transaction(async (manager) => {
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

      return {
        paymentId: payment.id,
        orderId: order.id,
        customerId,
        amount,
        currencyCode: payment.currencyCode.toUpperCase(),
        returnUrl: `${DOMAIN_URL}/payment-status/${payment.id}`,
        idempotencyKey: `payment:${payment.id}:initialize`,
      };
    });

    const result = await this.providers
      .getConfiguredProvider()
      .createPayment(input);
    await this.dataSource.transaction(async (manager) => {
      const payment = await manager.getRepository(PaymentEntity).findOne({
        where: { id: paymentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment || payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestException('Payment is no longer pending');
      }
      if (
        payment.providerPaymentId &&
        payment.providerPaymentId !== result.providerPaymentId
      ) {
        throw new BadRequestException(
          'Payment already has another provider reference',
        );
      }
      payment.provider = result.provider;
      payment.providerPaymentId = result.providerPaymentId;
      if (result.provider === MANUAL_PAYMENT_PROVIDER_NAME) {
        // A confirmed cash-on-delivery/manual order is not an abandoned
        // checkout - it must never be auto-cancelled by the pending-payment
        // expiration worker, which only acts on payments with a real
        // expiresAt (see shouldExpirePayment/isCheckoutPaymentActive).
        payment.expiresAt = null;
      }
      await manager.getRepository(PaymentEntity).save(payment);
      if (result.provider === MANUAL_PAYMENT_PROVIDER_NAME) {
        // Cash-on-delivery orders never reach PaymentCompletionService
        // (there is no webhook to complete them), so the cart's checkout
        // lock would otherwise remain set forever - isCheckoutPaymentActive
        // treats a payment that is PENDING with no expiresAt as still
        // active. Convert the cart now, at order confirmation time, the
        // same way a paid order is converted on payment completion.
        await this.carts.convert(manager, input.customerId, input.orderId);
      }
    });
    return result;
  }
}
