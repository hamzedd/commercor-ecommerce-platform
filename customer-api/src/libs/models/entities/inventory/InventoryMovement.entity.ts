import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
export enum InventoryMovementType {
  ORDER_RESERVATION = 'order_reservation',
  ORDER_RESTORE = 'order_restore',
  MANUAL_ADJUSTMENT = 'manual_adjustment',
  RESTOCK = 'restock',
  CORRECTION = 'correction',
}
@Entity('inventory_movements')
@Index('UQ_inventory_reference', ['referenceKey'], {
  unique: true,
  where: '"referenceKey" IS NOT NULL',
})
@Index('IDX_inventory_product_created', ['productId', 'created_at'])
export class InventoryMovementEntity extends BaseEntity {
  @Column() productId: string;
  @Column({ type: 'varchar', nullable: true }) variantId: string | null;
  @Column({ length: 40 }) type: InventoryMovementType;
  @Column({ type: 'integer' }) quantityDelta: number;
  @Column({ type: 'integer' }) quantityBefore: number;
  @Column({ type: 'integer' }) quantityAfter: number;
  @Column({ type: 'text', nullable: true }) reason: string | null;
  @Column({ type: 'varchar', nullable: true }) orderId: string | null;
  @Column({ type: 'varchar', nullable: true }) adminUserId: string | null;
  @Column({ type: 'varchar', nullable: true, length: 300 }) referenceKey: string | null;
}
