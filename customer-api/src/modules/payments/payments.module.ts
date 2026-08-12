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
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ManualDisabledPaymentProvider } from './providers/manual-disabled.provider';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { PaymentInitializationService } from './services/payment-initialization.service';
import { PaymentExpirationService } from './services/payment-expiration.service';
import { PaymentExpirationWorker } from './services/payment-expiration.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ProductEntity,
      CustomerEntity,
      PaymentEntity,
    ]),
    RewardsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentCompletionService,
    PaymentInitializationService,
    PaymentExpirationService,
    PaymentExpirationWorker,
    ManualDisabledPaymentProvider,
    PaymentProviderRegistry,
    AuthGuard,
  ],
  exports: [PaymentCompletionService, PaymentExpirationService],
})
export class PaymentsModule {}
