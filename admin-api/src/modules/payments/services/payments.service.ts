import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentRefundDto } from '@/src/libs/models/dtos/payments/PaymentRefund.dto';
import { BadRequestException, NotImplementedException } from '@nestjs/common';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerRewardAccountEntity } from '@/src/libs/models/entities/reward/CustomerRewardAccount.entity';
import { RewardTransactionEntity } from '@/src/libs/models/entities/reward/RewardTransaction.entity';
import { RewardTransactionType } from '@/src/utils/enums/RewardEnums';
import { PaymentRefundEntity } from '@/src/libs/models/entities/payment/PaymentRefund.entity';
import { OrderStatus, PaymentStatus } from '@/src/utils/enums/PaymentEnums';
import { assertRefund, remainingRefundable } from '../payment-state';

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
        throw new NotImplementedException('No payment provider refund integration is configured. A browser or admin request cannot confirm a provider refund.');
      }

      async recordVerifiedRefund(id:string,event:{provider:string;externalRefundId:string;amount:number}) {
        return this.paymentRepository.manager.transaction(async (manager) => {
          const paymentRepo = manager.getRepository(PaymentEntity);
          const refundRepo=manager.getRepository(PaymentRefundEntity);
          const duplicate=await refundRepo.findOneBy({externalRefundId:event.externalRefundId});
          if(duplicate){if(duplicate.paymentId!==id||Number(duplicate.amount)!==Number(event.amount))throw new BadRequestException('Refund reference conflicts with an existing refund');return {message:'Refund already recorded',idempotent:true};}
          const payment = await paymentRepo.findOneOrFail({
            where: { id },
            lock:{mode:'pessimistic_write'},
          });
          const paid=Number(payment.paidAmount??payment.totalAmount);const remaining=remainingRefundable(paid,Number(payment.refundedAmount));try{assertRefund(payment.status,event.amount,remaining);}catch(e){throw new BadRequestException((e as Error).message);}
          payment.refundedAmount=Number((Number(payment.refundedAmount)+event.amount).toFixed(2));
          const full=payment.refundedAmount===paid;payment.status=full?PaymentStatus.REFUNDED:PaymentStatus.PARTIALLY_REFUNDED;
          await refundRepo.save(refundRepo.create({paymentId:id,provider:event.provider,externalRefundId:event.externalRefundId,amount:event.amount,completedAt:new Date()}));
          if (full) {
            const order = await manager.getRepository(OrderEntity).findOne({where:{ paymentId: payment.id },lock:{mode:'pessimistic_write'}});
            if(order)order.status=OrderStatus.REFUNDED;
            if (order) await this.reverseFullRefund(manager, order, payment);
            if(order)await manager.getRepository(OrderEntity).save(order);
          }
          await paymentRepo.save(payment);
          return {message:'Verified refund recorded',idempotent:false};
        });
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
