import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { PasswordResetTokenEntity } from '@/src/libs/models/entities/customer/PasswordResetToken.entity';
import { NotificationsModule } from '@/src/modules/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, PasswordResetTokenEntity]),
    NotificationsModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
