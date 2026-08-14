import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentRefundEntity } from '@/src/libs/models/entities/payment/PaymentRefund.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerRewardAccountEntity } from '@/src/libs/models/entities/reward/CustomerRewardAccount.entity';
import { RewardTransactionEntity } from '@/src/libs/models/entities/reward/RewardTransaction.entity';
import { RewardTransactionType } from '@/src/utils/enums/RewardEnums';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { NotificationService } from '@/src/modules/notifications/notification.service';

@Injectable()
export class VerifiedRefundService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notifications: NotificationService,
  ) {}

  async record(
    paymentId: string,
    externalRefundId: string,
    amount: number,
    currencyCode: string,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const refunds = manager.getRepository(PaymentRefundEntity);
      const duplicate = await refunds.findOneBy({ externalRefundId });
      if (duplicate) {
        if (
          duplicate.paymentId !== paymentId ||
          Number(duplicate.amount) !== Number(amount)
        )
          throw new BadRequestException(
            'Refund reference conflicts with an existing refund',
          );
        return { status: 'recorded', idempotent: true };
      }
      const payment = await manager
        .getRepository(PaymentEntity)
        .findOne({
          where: { id: paymentId },
          lock: { mode: 'pessimistic_write' },
        });
      if (!payment) throw new BadRequestException('Payment does not exist');
      if (
        !payment.currencyCode ||
        payment.currencyCode.toUpperCase() !== currencyCode.toUpperCase()
      )
        throw new BadRequestException(
          'Refund currency does not match the payment currency',
        );
      const paid = Number(payment.paidAmount ?? payment.totalAmount);
      const remaining = Number(
        (paid - Number(payment.refundedAmount)).toFixed(2),
      );
      if (
        ![PaymentStatus.COMPLETED, PaymentStatus.PARTIALLY_REFUNDED].includes(
          payment.status as PaymentStatus,
        ) ||
        amount <= 0 ||
        amount > remaining
      ) {
        throw new BadRequestException(
          'Invalid verified refund amount or payment state',
        );
      }
      payment.refundedAmount = Number(
        (Number(payment.refundedAmount) + amount).toFixed(2),
      );
      const full = payment.refundedAmount === paid;
      payment.status = full
        ? PaymentStatus.REFUNDED
        : PaymentStatus.PARTIALLY_REFUNDED;
      await refunds.save(
        refunds.create({
          paymentId,
          provider: 'paypal',
          externalRefundId,
          amount,
          completedAt: new Date(),
        }),
      );
      if (full) {
        const order = await manager
          .getRepository(OrderEntity)
          .findOne({
            where: { paymentId },
            lock: { mode: 'pessimistic_write' },
          });
        if (order) {
          order.status = OrderStatus.REFUNDED;
          order.fulfillmentStatus = 'refunded';
          const accounts = manager.getRepository(CustomerRewardAccountEntity);
          const ledger = manager.getRepository(RewardTransactionEntity);
          const account = await accounts.findOne({
            where: { customerId: order.customerId },
            lock: { mode: 'pessimistic_write' },
          });
          if (account) {
            const points = await ledger.findOneBy({
              orderId: order.id,
              type: RewardTransactionType.EARN_POINTS,
            });
            const cashback = await ledger.findOneBy({
              orderId: order.id,
              type: RewardTransactionType.EARN_CASHBACK,
            });
            const reversePoints = Math.min(
              account.pointsBalance,
              Number(points?.pointsAmount || 0),
            );
            const reverseCashback = Math.min(
              Number(account.cashbackBalance),
              Number(cashback?.cashbackAmount || 0),
            );
            if (
              reversePoints &&
              !(await ledger.existsBy({
                orderId: order.id,
                type: RewardTransactionType.POINTS_REVERSAL,
              }))
            ) {
              account.pointsBalance -= reversePoints;
              await ledger.save(
                ledger.create({
                  customerId: order.customerId,
                  orderId: order.id,
                  paymentId,
                  type: RewardTransactionType.POINTS_REVERSAL,
                  pointsAmount: -reversePoints,
                  cashbackAmount: null,
                  description: 'Earned points reversed after full refund',
                  expiresAt: null,
                }),
              );
            }
            if (
              reverseCashback &&
              !(await ledger.existsBy({
                orderId: order.id,
                type: RewardTransactionType.CASHBACK_REVERSAL,
              }))
            ) {
              account.cashbackBalance =
                Number(account.cashbackBalance) - reverseCashback;
              await ledger.save(
                ledger.create({
                  customerId: order.customerId,
                  orderId: order.id,
                  paymentId,
                  type: RewardTransactionType.CASHBACK_REVERSAL,
                  pointsAmount: null,
                  cashbackAmount: -reverseCashback,
                  description: 'Earned cashback reversed after full refund',
                  expiresAt: null,
                }),
              );
            }
            if (
              (order.pointsRedeemed || Number(order.cashbackUsed)) &&
              !(await ledger.existsBy({
                orderId: order.id,
                type: RewardTransactionType.ADMIN_ADJUSTMENT,
              }))
            ) {
              account.pointsBalance += order.pointsRedeemed;
              account.cashbackBalance =
                Number(account.cashbackBalance) + Number(order.cashbackUsed);
              await ledger.save(
                ledger.create({
                  customerId: order.customerId,
                  orderId: order.id,
                  paymentId,
                  type: RewardTransactionType.ADMIN_ADJUSTMENT,
                  pointsAmount: order.pointsRedeemed || null,
                  cashbackAmount: Number(order.cashbackUsed) || null,
                  description: 'Redeemed rewards restored after full refund',
                  expiresAt: null,
                }),
              );
            }
            await accounts.save(account);
          }
          await manager.getRepository(OrderEntity).save(order);
        }
      }
      await manager.getRepository(PaymentEntity).save(payment);
      const notificationOrder = await manager
        .getRepository(OrderEntity)
        .findOneBy({ paymentId });
      if (notificationOrder)
        await this.notifications.queue(
          manager,
          'refund_completed',
          `refund_completed:${externalRefundId}`,
          notificationOrder,
          { amount },
        );
      return { status: payment.status, idempotent: false };
    });
  }
}
