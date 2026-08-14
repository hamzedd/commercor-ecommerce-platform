import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { SystemController } from './system.controller';

@Module({
  imports: [
    JwtModule.register({ secret: JWT_SECRET }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [SystemController],
  providers: [AuthGuard, RoleGuard],
})
export class SystemModule {}
