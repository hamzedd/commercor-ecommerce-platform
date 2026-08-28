import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
  DB_POOL_MAX,
  DB_CONNECTION_TIMEOUT_MS,
  DB_IDLE_TIMEOUT_MS,
} from '@/src/utils/environmentConstants';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './modules/customers/customers.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ProductsModule } from './modules/product/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductFiltersModule } from '@/src/modules/productFilters/productFilters.module';
import { UsersModule } from '@/src/modules/users/users.module';
import { AuthModule } from '@/src/modules/auth/auth.module';
import { MinioModule } from '@/src/modules/minio/minio.module';
import { FilesModule } from '@/src/modules/files/files.module';
import { DashboardModule } from '@/src/modules/dashboard/dashboard.module';
import { CommerceModule } from '@/src/modules/commerce/commerce.module';
import { RewardsModule } from '@/src/modules/rewards/rewards.module';
import { CouponsModule } from '@/src/modules/coupons/coupons.module';
import { ReviewsModule } from '@/src/modules/reviews/reviews.module';
import { InvoicesModule } from '@/src/modules/invoices/invoices.module';
import { InventoryModule } from '@/src/modules/inventory/inventory.module';
import { AbandonedCartsModule } from '@/src/modules/abandonedCarts/abandoned-carts.module';
import { PromotionsModule } from '@/src/modules/promotions/promotions.module';
import { AnalyticsModule } from '@/src/modules/analytics/analytics.module';
import { HealthController } from './health.controller';
import { SystemModule } from './modules/system/system.module';
import { AssistantModule } from './modules/assistant/assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: DB_TYPE as any,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      synchronize: false,
      extra: {
        max: DB_POOL_MAX,
        connectionTimeoutMillis: DB_CONNECTION_TIMEOUT_MS,
        idleTimeoutMillis: DB_IDLE_TIMEOUT_MS,
      },
      entities: [
        'dist/libs/models/entities/*.entity.{js,ts}',
        'dist/libs/models/entities/*/*.entity.{js,ts}',
      ],
    }),
    CategoriesModule,
    CustomersModule,
    BrandsModule,
    CompaniesModule,
    ProductFiltersModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    UsersModule,
    AuthModule,
    MinioModule,
    FilesModule,
    DashboardModule,
    CommerceModule,
    RewardsModule,
    CouponsModule,
    ReviewsModule,
    InvoicesModule,
    InventoryModule,
    AbandonedCartsModule,
    PromotionsModule,
    AnalyticsModule,
    SystemModule,
    AssistantModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
