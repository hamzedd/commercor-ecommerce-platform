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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
