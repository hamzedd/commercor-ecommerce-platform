import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { DashboardController } from '@/src/modules/dashboard/dashboard.controller';
import { DashboardService } from '@/src/modules/dashboard/dashboard.service';
import { JWT_SECRET } from '@/src/utils/environmentConstants';

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
      ProductEntity,
      UserEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, AuthGuard, RoleGuard],
})
export class DashboardModule {}
