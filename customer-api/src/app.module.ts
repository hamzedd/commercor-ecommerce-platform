import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from './utils/environmentConstants';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductFiltersModule } from './modules/productFilters/productFilters.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { PaymentsModule } from '@/src/modules/payments/payments.module';
import { CompanyDetailsModule } from '@/src/modules/companyDetails/companyDetails.module';

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
    ProductsModule,
    BrandsModule,
    CustomersModule,
    AuthModule,
    ProductFiltersModule,
    OrdersModule,
    AddressesModule,
    PaymentsModule,
    CompanyDetailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
