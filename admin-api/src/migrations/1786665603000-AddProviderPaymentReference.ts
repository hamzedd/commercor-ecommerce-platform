import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddProviderPaymentReference1786665603000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('payments', 'providerPaymentId'))) {
      await queryRunner.addColumn('payments', new TableColumn({ name: 'providerPaymentId', type: 'varchar', isNullable: true }));
    }
    const table = await queryRunner.getTable('payments');
    if (!table?.indices.some((index) => index.name === 'UQ_payments_provider_payment_id')) {
      await queryRunner.createIndex('payments', new TableIndex({ name: 'UQ_payments_provider_payment_id', columnNames: ['providerPaymentId'], isUnique: true, where: '"providerPaymentId" IS NOT NULL' }));
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');
    if (table?.indices.some((index) => index.name === 'UQ_payments_provider_payment_id')) await queryRunner.dropIndex('payments', 'UQ_payments_provider_payment_id');
    if (await queryRunner.hasColumn('payments', 'providerPaymentId')) await queryRunner.dropColumn('payments', 'providerPaymentId');
  }
}
