import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnsureProductFilterCategoryIndexes1787875200000
  implements MigrationInterface
{
  name = 'EnsureProductFilterCategoryIndexes1787875200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_product_filter_categories_filter" ON "product_filter_categories" ("productFilterId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_product_filter_categories_category" ON "product_filter_categories" ("categoryId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_product_filter_categories_filter"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_product_filter_categories_category"`,
    );
  }
}
