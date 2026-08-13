import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovementEntity } from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovementEntity])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
