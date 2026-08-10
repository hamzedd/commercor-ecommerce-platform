import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductFilterCategories1786310400000
  implements MigrationInterface
{
  name = 'AddProductFilterCategories1786310400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_filter_categories" (
        "productFilterId" uuid NOT NULL,
        "categoryId" uuid NOT NULL,
        CONSTRAINT "PK_product_filter_categories" PRIMARY KEY ("productFilterId", "categoryId"),
        CONSTRAINT "UQ_product_filter_categories" UNIQUE ("productFilterId", "categoryId"),
        CONSTRAINT "FK_product_filter_categories_filter" FOREIGN KEY ("productFilterId")
          REFERENCES "product_filters"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_product_filter_categories_category" FOREIGN KEY ("categoryId")
          REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_product_filter_categories_category"
      ON "product_filter_categories" ("categoryId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_product_filter_categories_category"`,
    );
    await queryRunner.query(`DROP TABLE "product_filter_categories"`);
  }
}
