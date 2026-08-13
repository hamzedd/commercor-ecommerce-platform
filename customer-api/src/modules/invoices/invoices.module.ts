import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';
import { InvoiceItemEntity } from '@/src/libs/models/entities/invoice/InvoiceItem.entity';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    JwtModule.register({ secret: JWT_SECRET }),
    TypeOrmModule.forFeature([
      InvoiceEntity,
      InvoiceItemEntity,
      CustomerEntity,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, AuthGuard],
  exports: [InvoicesService],
})
export class InvoicesModule {}
