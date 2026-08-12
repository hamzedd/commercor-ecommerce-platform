import { Module } from '@nestjs/common';
import {PaymentsController } from '@/src/modules/payments/controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerRewardAccountEntity } from '@/src/libs/models/entities/reward/CustomerRewardAccount.entity';
import { RewardTransactionEntity } from '@/src/libs/models/entities/reward/RewardTransaction.entity';
import { PaymentRefundEntity } from '@/src/libs/models/entities/payment/PaymentRefund.entity';
import { JwtModule } from '@nestjs/jwt'; import { JWT_SECRET } from '@/src/utils/environmentConstants'; import { UserEntity } from '@/src/libs/models/entities/user/User.entity'; import { AuthGuard } from '@/src/libs/guards/auth.guard'; import { RoleGuard } from '@/src/libs/guards/role.guard';

@Module({
  imports: [JwtModule.register({secret:JWT_SECRET,signOptions:{expiresIn:'1d'}}),TypeOrmModule.forFeature([PaymentEntity, PaymentRefundEntity, OrderEntity, CustomerRewardAccountEntity, RewardTransactionEntity,UserEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService,AuthGuard,RoleGuard],
})
export class PaymentsModule {}
