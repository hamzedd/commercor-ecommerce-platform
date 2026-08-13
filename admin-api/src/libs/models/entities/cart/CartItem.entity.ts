import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { CartEntity } from './Cart.entity';
@Entity('cart_items')
@Index('UQ_cart_item_simple', ['cartId', 'productId'], { unique: true, where: '"variantId" IS NULL AND "deleted_at" IS NULL' })
@Index('UQ_cart_item_variant', ['cartId', 'productId', 'variantId'], { unique: true, where: '"variantId" IS NOT NULL AND "deleted_at" IS NULL' })
export class CartItemEntity extends BaseEntity {
  @Column({ type: 'uuid' }) cartId: string;
  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'cartId' }) cart: CartEntity;
  @Column({ type: 'uuid' }) productId: string;
  @Column({ type: 'uuid', nullable: true }) variantId: string | null;
  @Column({ type: 'integer' }) quantity: number;
}
