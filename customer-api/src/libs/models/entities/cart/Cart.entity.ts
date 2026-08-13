import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { CartItemEntity } from './CartItem.entity';

export enum CartStatus { ACTIVE = 'active', ABANDONED = 'abandoned', CONVERTED = 'converted' }

@Entity('carts')
@Index('UQ_cart_customer_active', ['customerId'], { unique: true, where: '"status" = \'active\' AND "deleted_at" IS NULL' })
@Index('IDX_cart_abandonment', ['status', 'lastActivityAt'])
export class CartEntity extends BaseEntity {
  @Column({ type: 'uuid' }) customerId: string;
  @Column({ type: 'varchar', length: 20, default: CartStatus.ACTIVE }) status: CartStatus;
  @Column({ type: 'timestamp' }) lastActivityAt: Date;
  @Column({ type: 'timestamp', nullable: true }) abandonedAt: Date | null;
  @Column({ type: 'timestamp', nullable: true }) recoveredAt: Date | null;
  @Column({ type: 'uuid', nullable: true }) convertedOrderId: string | null;
  @Column({ type: 'uuid', nullable: true }) checkoutOrderId: string | null;
  @Column({ type: 'timestamp', nullable: true }) recoveryEmailSentAt: Date | null;
  @Column({ type: 'integer', default: 0 }) abandonmentCycle: number;
  @OneToMany(() => CartItemEntity, (item) => item.cart) items: CartItemEntity[];
}
