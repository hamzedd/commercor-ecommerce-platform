import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddPendingPaymentExpiration1786665602000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('payments', 'expiresAt'))) {
      await queryRunner.addColumn(
        'payments',
        new TableColumn({
          name: 'expiresAt',
          type: 'timestamp',
          isNullable: true,
        }),
      );
    }
    if (!(await queryRunner.hasColumn('payments', 'cancellationReason'))) {
      await queryRunner.addColumn(
        'payments',
        new TableColumn({
          name: 'cancellationReason',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    const table = await queryRunner.getTable('payments');
    if (
      !table?.indices.some(
        (index) => index.name === 'IDX_payments_pending_expiry',
      )
    ) {
      await queryRunner.createIndex(
        'payments',
        new TableIndex({
          name: 'IDX_payments_pending_expiry',
          columnNames: ['status', 'expiresAt'],
          where: '"expiresAt" IS NOT NULL',
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');
    if (
      table?.indices.some(
        (index) => index.name === 'IDX_payments_pending_expiry',
      )
    ) {
      await queryRunner.dropIndex('payments', 'IDX_payments_pending_expiry');
    }
    if (await queryRunner.hasColumn('payments', 'cancellationReason')) {
      await queryRunner.dropColumn('payments', 'cancellationReason');
    }
    if (await queryRunner.hasColumn('payments', 'expiresAt')) {
      await queryRunner.dropColumn('payments', 'expiresAt');
    }
  }
}
