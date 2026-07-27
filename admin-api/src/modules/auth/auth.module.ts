import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@/src/modules/auth/controllers/auth.controller';
import { AuthService } from '@/src/modules/auth/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
