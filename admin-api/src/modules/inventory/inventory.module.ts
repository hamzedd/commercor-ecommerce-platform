import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@/src/libs/guards/auth.guard';
import { RoleGuard } from '@/src/libs/guards/role.guard';
import { InventoryMovementEntity } from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { JWT_SECRET } from '@/src/utils/environmentConstants';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([InventoryMovementEntity, UserEntity]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, AuthGuard, RoleGuard],
  exports: [InventoryService],
})
export class InventoryModule {}
