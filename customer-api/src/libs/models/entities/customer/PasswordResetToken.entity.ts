import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
@Entity('password_reset_tokens')
@Index('UQ_password_reset_hash', ['tokenHash'], { unique: true })
@Index('IDX_password_reset_customer_active', [
  'customerId',
  'usedAt',
  'expiresAt',
])
export class PasswordResetTokenEntity extends BaseEntity {
  @Column() customerId: string;
  @Column({ length: 64 }) tokenHash: string;
  @Column({ type: 'timestamp' }) expiresAt: Date;
  @Column({ type: 'timestamp', nullable: true }) usedAt: Date | null;
}
