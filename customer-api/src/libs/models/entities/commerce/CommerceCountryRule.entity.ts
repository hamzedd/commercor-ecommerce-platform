import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@/src/libs/models/entities/BaseEntity';

@Entity('commerce_country_rules')
@Index(['countryCode'], { unique: true, where: '"deleted_at" IS NULL' })
export class CommerceCountryRuleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 2 }) countryCode: string;
  @Column({ default: false }) shippingEnabled: boolean;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) shippingFee: number | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) freeShippingThreshold: number | null;
  @Column({ default: false }) taxEnabled: boolean;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) taxRate: number | null;
}
