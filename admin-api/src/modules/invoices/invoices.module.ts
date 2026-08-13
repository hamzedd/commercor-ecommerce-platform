import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';
import { InvoiceItemEntity } from '@/src/libs/models/entities/invoice/InvoiceItem.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
