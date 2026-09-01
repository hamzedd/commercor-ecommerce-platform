import { BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { MANUAL_PAYMENT_PROVIDER_NAME } from '@/src/utils/constants/PaymentProviders';

describe('PaymentsService.markManualPaymentPaid', () => {
  function service(payment: any, order: any) {
    const paymentRepo = {
      findOne: jest.fn(async () => payment),
      save: jest.fn(async (value: any) => Object.assign(payment, value)),
    };
    const orderRepo = {
      findOne: jest.fn(async () => order),
      save: jest.fn(async (value: any) => Object.assign(order, value)),
    };
    const manager = {
      getRepository: jest.fn((entity) =>
        entity.name === 'PaymentEntity' ? paymentRepo : orderRepo,
      ),
    };
    const paymentRepository = {
      manager: { transaction: jest.fn(async (work: any) => work(manager)) },
    };
    return {
      target: new PaymentsService(paymentRepository as any, {} as any),
      paymentRepo,
      orderRepo,
    };
  }

  it('marks a pending COD payment paid and completes the order (delivered COD order can be marked paid)', async () => {
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
      totalAmount: 42,
      paidAmount: null,
      completedAt: null,
    };
    const order: any = {
      id: 'order',
      paymentId: 'payment',
      status: OrderStatus.PENDING,
      fulfillmentStatus: 'delivered',
    };
    const { target } = service(payment, order);

    await expect(target.markManualPaymentPaid('payment')).resolves.toEqual({
      message: 'Payment marked as paid',
      idempotent: false,
    });
    expect(payment.status).toBe(PaymentStatus.COMPLETED);
    expect(payment.paidAmount).toBe(42);
    expect(payment.completedAt).toBeInstanceOf(Date);
    expect(order.status).toBe(OrderStatus.COMPLETED);
  });

  it('does NOT complete the order when marking payment paid before delivery (payment-received-first sequence)', async () => {
    // Regression for the b402b9a follow-up bug: markManualPaymentPaid()
    // used to set order.status = COMPLETED unconditionally, so an order
    // that was merely PENDING/PROCESSING/SHIPPED showed as "completed" in
    // admin the instant staff collected cash, even though fulfillment
    // hadn't reached DELIVERED yet.
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
      totalAmount: 42,
      paidAmount: null,
      completedAt: null,
    };
    const order: any = {
      id: 'order',
      paymentId: 'payment',
      status: OrderStatus.PENDING,
      fulfillmentStatus: 'shipped',
    };
    const { target, orderRepo } = service(payment, order);

    await expect(target.markManualPaymentPaid('payment')).resolves.toEqual({
      message: 'Payment marked as paid',
      idempotent: false,
    });
    expect(payment.status).toBe(PaymentStatus.COMPLETED);
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.fulfillmentStatus).toBe('shipped');
    expect(orderRepo.save).not.toHaveBeenCalled();
  });

  it('rejects a non-manual (gateway) payment', async () => {
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.PENDING,
      provider: 'paypal',
    };
    const { target } = service(payment, null);

    await expect(target.markManualPaymentPaid('payment')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(payment.status).toBe(PaymentStatus.PENDING);
  });

  it('is idempotent for an already-completed payment', async () => {
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.COMPLETED,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
    };
    const { target, paymentRepo, orderRepo } = service(payment, null);

    await expect(target.markManualPaymentPaid('payment')).resolves.toEqual({
      message: 'Payment already marked as paid',
      idempotent: true,
    });
    expect(paymentRepo.save).not.toHaveBeenCalled();
    expect(orderRepo.save).not.toHaveBeenCalled();
  });

  it('rejects a COD payment that is not pending (e.g. failed/cancelled)', async () => {
    const payment: any = {
      id: 'payment',
      status: PaymentStatus.FAILED,
      provider: MANUAL_PAYMENT_PROVIDER_NAME,
    };
    const { target } = service(payment, null);

    await expect(target.markManualPaymentPaid('payment')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
