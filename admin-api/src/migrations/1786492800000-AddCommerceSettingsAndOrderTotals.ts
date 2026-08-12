import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from 'typeorm';

export class AddCommerceSettingsAndOrderTotals1786492800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('commerce_settings'))) {
      await queryRunner.createTable(new Table({ name: 'commerce_settings', columns: this.baseColumns.concat([
        { name: 'shippingEnabled', type: 'boolean', default: false },
        { name: 'defaultShippingFee', type: 'decimal', precision: 12, scale: 2, default: 0 },
        { name: 'freeShippingThreshold', type: 'decimal', precision: 12, scale: 2, isNullable: true },
        { name: 'taxEnabled', type: 'boolean', default: false },
        { name: 'defaultTaxRate', type: 'decimal', precision: 5, scale: 2, default: 0 },
        { name: 'pricesIncludeTax', type: 'boolean', default: false },
      ]) }));
    }
    if (!(await queryRunner.hasTable('commerce_country_rules'))) {
      await queryRunner.createTable(new Table({ name: 'commerce_country_rules', columns: this.baseColumns.concat([
        { name: 'countryCode', type: 'varchar', length: '2' },
        { name: 'shippingEnabled', type: 'boolean', default: false },
        { name: 'shippingFee', type: 'decimal', precision: 12, scale: 2, isNullable: true },
        { name: 'freeShippingThreshold', type: 'decimal', precision: 12, scale: 2, isNullable: true },
        { name: 'taxEnabled', type: 'boolean', default: false },
        { name: 'taxRate', type: 'decimal', precision: 5, scale: 2, isNullable: true },
      ]) }));
      await queryRunner.createIndex('commerce_country_rules', new TableIndex({ name: 'IDX_commerce_country_rules_country_active', columnNames: ['countryCode'], isUnique: true, where: '"deleted_at" IS NULL' }));
    }
    if (!(await queryRunner.hasColumn('orders', 'taxAmount'))) await queryRunner.addColumn('orders', new TableColumn({ name: 'taxAmount', type: 'decimal', precision: 12, scale: 2, default: 0 }));
    if (!(await queryRunner.hasColumn('orders', 'finalTotal'))) {
      await queryRunner.addColumn('orders', new TableColumn({ name: 'finalTotal', type: 'decimal', precision: 12, scale: 2, default: 0 }));
      await queryRunner.query('UPDATE "orders" SET "finalTotal" = COALESCE("productAmount", 0) + COALESCE("deliveryAmount", 0)');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('orders', 'finalTotal')) await queryRunner.dropColumn('orders', 'finalTotal');
    if (await queryRunner.hasColumn('orders', 'taxAmount')) await queryRunner.dropColumn('orders', 'taxAmount');
    if (await queryRunner.hasTable('commerce_country_rules')) await queryRunner.dropTable('commerce_country_rules');
    if (await queryRunner.hasTable('commerce_settings')) await queryRunner.dropTable('commerce_settings');
  }

  private readonly baseColumns: any[] = [
    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
    { name: 'created_at', type: 'timestamp', default: 'now()' },
    { name: 'updated_at', type: 'timestamp', default: 'now()' },
    { name: 'deleted_at', type: 'timestamp', isNullable: true },
  ];
}
