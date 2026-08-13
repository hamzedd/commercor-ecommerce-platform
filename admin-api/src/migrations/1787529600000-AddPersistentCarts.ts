import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddPersistentCarts1787529600000 implements MigrationInterface {
  name='AddPersistentCarts1787529600000';
  public async up(q:QueryRunner):Promise<void>{
    await q.query(`CREATE TABLE "carts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "customerId" uuid NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'active', "lastActivityAt" TIMESTAMP NOT NULL DEFAULT now(), "abandonedAt" TIMESTAMP, "recoveredAt" TIMESTAMP, "convertedOrderId" uuid, "checkoutOrderId" uuid, "recoveryEmailSentAt" TIMESTAMP, "abandonmentCycle" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_carts" PRIMARY KEY ("id"))`);
    await q.query(`CREATE UNIQUE INDEX "UQ_cart_customer_active" ON "carts" ("customerId") WHERE "status" = 'active' AND "deleted_at" IS NULL`);
    await q.query(`CREATE INDEX "IDX_cart_abandonment" ON "carts" ("status", "lastActivityAt")`);
    await q.query(`CREATE TABLE "cart_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "cartId" uuid NOT NULL, "productId" uuid NOT NULL, "variantId" uuid, "quantity" integer NOT NULL, CONSTRAINT "CHK_cart_item_quantity" CHECK ("quantity" > 0), CONSTRAINT "PK_cart_items" PRIMARY KEY ("id"), CONSTRAINT "FK_cart_items_cart" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE)`);
    await q.query(`CREATE UNIQUE INDEX "UQ_cart_item_simple" ON "cart_items" ("cartId", "productId") WHERE "variantId" IS NULL AND "deleted_at" IS NULL`);
    await q.query(`CREATE UNIQUE INDEX "UQ_cart_item_variant" ON "cart_items" ("cartId", "productId", "variantId") WHERE "variantId" IS NOT NULL AND "deleted_at" IS NULL`);
    await q.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_carts_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE`);
    await q.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_carts_converted_order" FOREIGN KEY ("convertedOrderId") REFERENCES "orders"("id") ON DELETE SET NULL`);
    await q.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_carts_checkout_order" FOREIGN KEY ("checkoutOrderId") REFERENCES "orders"("id") ON DELETE SET NULL`);
  }
  public async down(q:QueryRunner):Promise<void>{await q.query(`DROP TABLE "cart_items"`);await q.query(`DROP TABLE "carts"`)}
}
