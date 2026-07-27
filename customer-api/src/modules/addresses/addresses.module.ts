import { Module } from '@nestjs/common';
import { AddressesController } from '@/src/modules/addresses/controllers/addresses.controller';
import { AddressesService } from './services/addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '@/src/libs/models/entities/customer/Address.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '@/src/utils/environmentConstants';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressEntity, CustomerEntity]),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  controllers: [AddressesController],
  providers: [AddressesService, AuthGuard],
})
export class AddressesModule {}
