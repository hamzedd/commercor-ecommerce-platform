import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { ProductEntity } from '../product/Product.entity';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  orderId: string;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;
  @Column({ type: 'varchar', nullable: true }) variantId: string | null;
  @Column({ type: 'varchar', nullable: true, length: 100 }) variantSku: string | null;
  @Column({ type: 'varchar', nullable: true, length: 1000 }) variantDescription: string | null;
}
