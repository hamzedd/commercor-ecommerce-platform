import { forwardRef, Module } from '@nestjs/common';
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
import { PayPalPaymentProvider } from './providers/paypal.provider';
import { PayPalPaymentService } from './services/paypal-payment.service';
import { PayPalWebhookService } from './services/paypal-webhook.service';
import { PaymentRefundEntity } from '@/src/libs/models/entities/payment/PaymentRefund.entity';
import { CustomerRewardAccountEntity } from '@/src/libs/models/entities/reward/CustomerRewardAccount.entity';
import { RewardTransactionEntity } from '@/src/libs/models/entities/reward/RewardTransaction.entity';
import { VerifiedRefundService } from './services/verified-refund.service';
import { CouponEntity } from '@/src/libs/models/entities/coupon/Coupon.entity';
import { CouponUsageEntity } from '@/src/libs/models/entities/coupon/CouponUsage.entity';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import { NotificationsModule } from '@/src/modules/notifications/notifications.module';
import { InvoicesModule } from '@/src/modules/invoices/invoices.module';
import { CartModule } from '@/src/modules/cart/cart.module';
import { PromotionEntity } from '@/src/libs/models/entities/promotion/Promotion.entity';
import { PromotionUsageEntity } from '@/src/libs/models/entities/promotion/PromotionUsage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ProductEntity,
      CustomerEntity,
      PaymentEntity,
      PaymentRefundEntity,
      CustomerRewardAccountEntity,
      RewardTransactionEntity,
      CouponEntity,
      CouponUsageEntity,
      ProductVariantEntity,
      PromotionEntity,
      PromotionUsageEntity,
    ]),
    RewardsModule,
    NotificationsModule,
    InvoicesModule,
    forwardRef(() => CartModule),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentCompletionService,
    PaymentInitializationService,
    PaymentExpirationService,
    PaymentExpirationWorker,
    ManualDisabledPaymentProvider,
    PayPalPaymentProvider,
    PaymentProviderRegistry,
    PayPalPaymentService,
    PayPalWebhookService,
    VerifiedRefundService,
    AuthGuard,
  ],
  exports: [PaymentCompletionService, PaymentExpirationService],
})
export class PaymentsModule {}
