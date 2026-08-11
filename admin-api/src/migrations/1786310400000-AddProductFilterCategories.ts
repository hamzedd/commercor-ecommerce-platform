import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddProductFilterCategories1786310400000
  implements MigrationInterface
{
  private readonly tableName = 'product_filter_categories';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable(this.tableName)) return;

    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'productFilterId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'categoryId',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys(this.tableName, [
      new TableForeignKey({
        name: 'FK_product_filter_categories_filter',
        columnNames: ['productFilterId'],
        referencedTableName: 'product_filters',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_product_filter_categories_category',
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);

    await queryRunner.createIndices(this.tableName, [
      new TableIndex({
        name: 'IDX_product_filter_categories_filter',
        columnNames: ['productFilterId'],
      }),
      new TableIndex({
        name: 'IDX_product_filter_categories_category',
        columnNames: ['categoryId'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable(this.tableName))) return;
    await queryRunner.dropTable(this.tableName, true);
  }
}
