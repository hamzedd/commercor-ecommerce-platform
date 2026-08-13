import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
export class AddNotificationOutbox1787184000000 implements MigrationInterface {
  async up(q: QueryRunner) {
    await q.createTable(
      new Table({
        name: 'notification_outbox',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'type', type: 'varchar', length: '200' },
          { name: 'deduplicationKey', type: 'varchar', length: '300' },
          { name: 'customerId', type: 'uuid', isNullable: true },
          { name: 'orderId', type: 'uuid', isNullable: true },
          { name: 'recipientEmail', type: 'varchar', length: '320' },
          { name: 'subject', type: 'varchar', length: '300' },
          { name: 'payload', type: 'jsonb' },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          { name: 'attempts', type: 'integer', default: 0 },
          { name: 'lastError', type: 'text', isNullable: true },
          { name: 'nextAttemptAt', type: 'timestamp', isNullable: true },
          { name: 'sentAt', type: 'timestamp', isNullable: true },
        ],
        checks: [
          {
            name: 'CHK_notification_status',
            expression: `"status" IN ('pending','sent','failed')`,
          },
        ],
      }),
    );
    await q.createIndex(
      'notification_outbox',
      new TableIndex({
        name: 'UQ_notification_dedupe',
        columnNames: ['deduplicationKey'],
        isUnique: true,
      }),
    );
    await q.createIndex(
      'notification_outbox',
      new TableIndex({
        name: 'IDX_notification_delivery',
        columnNames: ['status', 'nextAttemptAt'],
      }),
    );
  }
  async down(q: QueryRunner) {
    await q.dropTable('notification_outbox');
  }
}
