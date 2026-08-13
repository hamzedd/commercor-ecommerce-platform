import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { InvoiceEntity } from '@/src/libs/models/entities/invoice/Invoice.entity';
import { InvoiceItemEntity } from '@/src/libs/models/entities/invoice/InvoiceItem.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([
      InvoiceEntity,
      InvoiceItemEntity,
      UserEntity,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, AuthGuard, RoleGuard],
})
export class InvoicesModule {}
