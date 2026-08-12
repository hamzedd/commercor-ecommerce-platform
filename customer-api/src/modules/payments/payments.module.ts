import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { PaymentsController } from '@/src/modules/payments/controllers/payments.controller';
import { PaymentsService } from '@/src/modules/payments/services/payments.service';
import { PaymentCompletionService } from './payment-completion.service';
import { RewardsModule } from '@/src/modules/rewards/rewards.module';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity'; import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity, CustomerEntity, PaymentEntity]),
    RewardsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentCompletionService, AuthGuard],
  exports: [PaymentCompletionService],
})
export class PaymentsModule {}
