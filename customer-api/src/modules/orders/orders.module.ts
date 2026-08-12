import { Module } from '@nestjs/common';
import { OrdersController } from '@/src/modules/orders/controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { PricingService } from './services/pricing.service';
import { RewardsModule } from '@/src/modules/rewards/rewards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CustomerEntity, OrderItemEntity]),
    RewardsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PricingService],
})
export class OrdersModule {}
