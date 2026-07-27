import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { UsersController } from '@/src/modules/users/controllers/users.controller';
import { UsersService } from '@/src/modules/users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
