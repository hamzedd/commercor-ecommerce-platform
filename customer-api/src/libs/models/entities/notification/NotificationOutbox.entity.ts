import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
export enum OutboxStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}
@Entity('notification_outbox')
@Index('UQ_notification_dedupe', ['deduplicationKey'], { unique: true })
@Index('IDX_notification_delivery', ['status', 'nextAttemptAt'])
export class NotificationOutboxEntity extends BaseEntity {
  @Column({ length: 200 }) type: string;
  @Column({ length: 300 }) deduplicationKey: string;
  @Column({ nullable: true }) customerId: string | null;
  @Column({ nullable: true }) orderId: string | null;
  @Column({ length: 320 }) recipientEmail: string;
  @Column({ length: 300 }) subject: string;
  @Column({ type: 'jsonb' }) payload: Record<string, unknown>;
  @Column({ length: 20, default: OutboxStatus.PENDING }) status: OutboxStatus;
  @Column({ type: 'integer', default: 0 }) attempts: number;
  @Column({ type: 'text', nullable: true }) lastError: string | null;
  @Column({ type: 'timestamp', nullable: true }) nextAttemptAt: Date | null;
  @Column({ type: 'timestamp', nullable: true }) sentAt: Date | null;
}
