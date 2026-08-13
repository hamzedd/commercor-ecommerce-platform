import { Module } from '@nestjs/common';
import { OrdersController } from '@/src/modules/orders/controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { PricingService } from './services/pricing.service';
import { RewardsModule } from '@/src/modules/rewards/rewards.module';
import { CouponEntity } from '@/src/libs/models/entities/coupon/Coupon.entity';
import { CouponUsageEntity } from '@/src/libs/models/entities/coupon/CouponUsage.entity';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import { OrderStatusHistoryEntity } from '@/src/libs/models/entities/order/OrderStatusHistory.entity';
import { NotificationsModule } from '@/src/modules/notifications/notifications.module';
import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CustomerEntity, OrderItemEntity, CouponEntity, CouponUsageEntity, ProductVariantEntity,OrderStatusHistoryEntity, InvoiceEntity]),
    RewardsModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PricingService],
})
export class OrdersModule {}
