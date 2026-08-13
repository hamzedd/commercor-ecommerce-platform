import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovementEntity } from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
import { InventoryService } from './inventory.service';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovementEntity])],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
