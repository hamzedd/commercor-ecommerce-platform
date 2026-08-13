import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';
export class AddInventoryManagement1787356800000 implements MigrationInterface {
  async up(q: QueryRunner) {
    await q.addColumn(
      'products',
      new TableColumn({
        name: 'lowStockThreshold',
        type: 'integer',
        isNullable: true,
      }),
    );
    await q.addColumn(
      'product_variants',
      new TableColumn({
        name: 'lowStockThreshold',
        type: 'integer',
        isNullable: true,
      }),
    );
    await q.query(
      'ALTER TABLE "products" ADD CONSTRAINT "CHK_product_low_stock" CHECK ("lowStockThreshold" IS NULL OR "lowStockThreshold" >= 0)',
    );
    await q.query(
      'ALTER TABLE "product_variants" ADD CONSTRAINT "CHK_variant_low_stock" CHECK ("lowStockThreshold" IS NULL OR "lowStockThreshold" >= 0)',
    );
    await q.createTable(
      new Table({
        name: 'inventory_movements',
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
          { name: 'productId', type: 'uuid' },
          { name: 'variantId', type: 'uuid', isNullable: true },
          { name: 'type', type: 'varchar', length: '40' },
          { name: 'quantityDelta', type: 'integer' },
          { name: 'quantityBefore', type: 'integer' },
          { name: 'quantityAfter', type: 'integer' },
          { name: 'reason', type: 'text', isNullable: true },
          { name: 'orderId', type: 'uuid', isNullable: true },
          { name: 'adminUserId', type: 'uuid', isNullable: true },
          {
            name: 'referenceKey',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
        ],
        checks: [
          {
            name: 'CHK_inventory_quantities',
            expression: '"quantityBefore" >= 0 AND "quantityAfter" >= 0',
          },
        ],
      }),
    );
    await q.createIndex(
      'inventory_movements',
      new TableIndex({
        name: 'UQ_inventory_reference',
        columnNames: ['referenceKey'],
        isUnique: true,
        where: '"referenceKey" IS NOT NULL',
      }),
    );
    await q.createIndex(
      'inventory_movements',
      new TableIndex({
        name: 'IDX_inventory_product_created',
        columnNames: ['productId', 'created_at'],
      }),
    );
  }
  async down(q: QueryRunner) {
    await q.dropTable('inventory_movements');
    await q.query(
      'ALTER TABLE "product_variants" DROP CONSTRAINT "CHK_variant_low_stock"',
    );
    await q.query(
      'ALTER TABLE "products" DROP CONSTRAINT "CHK_product_low_stock"',
    );
    await q.dropColumn('product_variants', 'lowStockThreshold');
    await q.dropColumn('products', 'lowStockThreshold');
  }
}
