import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';

@Entity('commerce_settings')
export class CommerceSettingsEntity extends BaseEntity {
  @Column({ default: false }) shippingEnabled: boolean;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) defaultShippingFee: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) freeShippingThreshold: number | null;
  @Column({ default: false }) taxEnabled: boolean;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) defaultTaxRate: number;
  @Column({ default: false }) pricesIncludeTax: boolean;
}
