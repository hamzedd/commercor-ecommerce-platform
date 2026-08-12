import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentRefundDto } from '@/src/libs/models/dtos/payments/PaymentRefund.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerRewardAccountEntity } from '@/src/libs/models/entities/reward/CustomerRewardAccount.entity';
import { RewardTransactionEntity } from '@/src/libs/models/entities/reward/RewardTransaction.entity';
import { RewardTransactionType } from '@/src/utils/enums/RewardEnums';

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
          if (Number(payment.refundedAmount) === Number(payment.totalAmount)) {
            const order = await manager.getRepository(OrderEntity).findOneBy({ paymentId: payment.id });
            if (order) await this.reverseFullRefund(manager, order, payment);
          }
          await paymentRepo.save(payment);
        });
     
        return { message: 'Payment updated successfully' };
      }

      private async reverseFullRefund(manager: any, order: OrderEntity, payment: PaymentEntity) {
        const accounts = manager.getRepository(CustomerRewardAccountEntity);
        const ledger = manager.getRepository(RewardTransactionEntity);
        const account = await accounts.findOne({ where: { customerId: order.customerId }, lock: { mode: 'pessimistic_write' } });
        if (!account) return;
        const add = async (type: RewardTransactionType, points: number | null, cashback: number | null, description: string) => {
          if (await ledger.existsBy({ orderId: order.id, type })) return;
          await ledger.save(ledger.create({ customerId: order.customerId, orderId: order.id, paymentId: payment.id, type, pointsAmount: points, cashbackAmount: cashback, description, expiresAt: null }));
        };
        const earnedPoints = await ledger.findOneBy({ orderId: order.id, type: RewardTransactionType.EARN_POINTS });
        const earnedCashback = await ledger.findOneBy({ orderId: order.id, type: RewardTransactionType.EARN_CASHBACK });
        const pointsToReverse = Math.min(account.pointsBalance, Number(earnedPoints?.pointsAmount || 0));
        const cashbackToReverse = Math.min(Number(account.cashbackBalance), Number(earnedCashback?.cashbackAmount || 0));
        if (pointsToReverse) { account.pointsBalance -= pointsToReverse; await add(RewardTransactionType.POINTS_REVERSAL, -pointsToReverse, null, 'Earned points reversed after full refund'); }
        if (cashbackToReverse) { account.cashbackBalance = Number(account.cashbackBalance) - cashbackToReverse; await add(RewardTransactionType.CASHBACK_REVERSAL, null, -cashbackToReverse, 'Earned cashback reversed after full refund'); }
        if (order.pointsRedeemed) account.pointsBalance += order.pointsRedeemed;
        if (Number(order.cashbackUsed)) account.cashbackBalance = Number(account.cashbackBalance) + Number(order.cashbackUsed);
        if (order.pointsRedeemed || Number(order.cashbackUsed)) await add(RewardTransactionType.ADMIN_ADJUSTMENT, order.pointsRedeemed || null, Number(order.cashbackUsed) || null, 'Redeemed rewards restored after full refund');
        await accounts.save(account);
      }
}
