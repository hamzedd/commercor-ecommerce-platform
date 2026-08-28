import { Module } from '@nestjs/common';
import { OrdersController } from '@/src/modules/orders/controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { OrderStatusHistoryEntity } from '@/src/libs/models/entities/order/OrderStatusHistory.entity';
import { FulfillmentService } from './services/fulfillment.service';
import { NotificationOutboxEntity } from '@/src/libs/models/entities/notification/NotificationOutbox.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      PaymentEntity,
      UserEntity,
      OrderStatusHistoryEntity,
      NotificationOutboxEntity,
      CustomerEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, FulfillmentService, AuthGuard, RoleGuard],
  exports: [OrdersService],
})
export class OrdersModule {}
