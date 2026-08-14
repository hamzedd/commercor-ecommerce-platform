import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseDecimalMoneyColumns1787961600000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "totalAmount" TYPE numeric(12,2) USING "totalAmount"::numeric, ALTER COLUMN "refundedAmount" TYPE numeric(12,2) USING "refundedAmount"::numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "productAmount" TYPE numeric(12,2) USING "productAmount"::numeric, ALTER COLUMN "deliveryAmount" TYPE numeric(12,2) USING "deliveryAmount"::numeric`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "totalAmount" TYPE integer USING round("totalAmount")::integer, ALTER COLUMN "refundedAmount" TYPE integer USING round("refundedAmount")::integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "productAmount" TYPE integer USING round("productAmount")::integer, ALTER COLUMN "deliveryAmount" TYPE integer USING round("deliveryAmount")::integer`,
    );
  }
}
