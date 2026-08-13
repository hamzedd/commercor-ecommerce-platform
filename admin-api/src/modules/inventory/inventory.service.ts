import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import {
  InventoryMovementEntity,
  InventoryMovementType,
} from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
import { effectiveThreshold, stockStatus } from './inventory-policy';
@Injectable()
export class InventoryService {
  constructor(private db: DataSource) {}
  async list() {
    const products = await this.db
      .getRepository(ProductEntity)
      .find({
        relations: {
          translations: true,
          variants: { values: { optionValue: { option: true } } },
        },
      });
    const movements = await this.db
      .getRepository(InventoryMovementEntity)
      .createQueryBuilder('m')
      .distinctOn(['m.productId', 'm.variantId'])
      .orderBy('m.productId')
      .addOrderBy('m.variantId')
      .addOrderBy('m.created_at', 'DESC')
      .getMany();
    const last = new Map(
      movements.map((m) => [
        `${m.productId}:${m.variantId || ''}`,
        m.created_at,
      ]),
    );
    return products.flatMap((p) =>
      p.variants?.length
        ? p.variants.map((v) => {
            const threshold = effectiveThreshold(
              v.lowStockThreshold,
              p.lowStockThreshold,
            );
            return {
              productId: p.id,
              productName:
                p.translations?.find((t) => t.lang === 'en')?.name ||
                p.translations?.[0]?.name ||
                p.id,
              variantId: v.id,
              variantDescription:
                v.values?.map((a) => a.optionValue.value).join(' / ') || '',
              sku: v.sku,
              stock: v.stock,
              threshold,
              status: stockStatus(v.stock, threshold),
              lastMovementAt: last.get(`${p.id}:${v.id}`) || null,
            };
          })
        : [
            {
              productId: p.id,
              productName:
                p.translations?.find((t) => t.lang === 'en')?.name ||
                p.translations?.[0]?.name ||
                p.id,
              variantId: null,
              variantDescription: null,
              sku: null,
              stock: p.stock,
              threshold: effectiveThreshold(null, p.lowStockThreshold),
              status: stockStatus(
                p.stock,
                effectiveThreshold(null, p.lowStockThreshold),
              ),
              lastMovementAt: last.get(`${p.id}:`) || null,
            },
          ],
    );
  }
  movements() {
    return this.db
      .getRepository(InventoryMovementEntity)
      .find({ order: { created_at: 'DESC' }, take: 500 });
  }
  adjust(userId: string, d: any, set = false) {
    return this.db.transaction(async (m) => {
      const target = d.variantId
        ? await m
            .getRepository(ProductVariantEntity)
            .findOne({
              where: { id: d.variantId, productId: d.productId },
              lock: { mode: 'pessimistic_write' },
            })
        : await m
            .getRepository(ProductEntity)
            .findOne({
              where: { id: d.productId },
              lock: { mode: 'pessimistic_write' },
            });
      if (!target) throw new BadRequestException('Inventory target not found');
      const delta = set ? d.stock - target.stock : d.adjustment;
      if (delta === 0) return { stock: target.stock, idempotent: true };
      if (delta < 0 && !d.reason?.trim())
        throw new BadRequestException('Reason is required when removing stock');
      const before = target.stock,
        after = before + delta;
      if (after < 0)
        throw new BadRequestException('Stock cannot be reduced below zero');
      target.stock = after;
      await m.save(target);
      await m
        .getRepository(InventoryMovementEntity)
        .save({
          productId: d.productId,
          variantId: d.variantId || null,
          type: set
            ? InventoryMovementType.CORRECTION
            : delta > 0
            ? InventoryMovementType.RESTOCK
            : InventoryMovementType.MANUAL_ADJUSTMENT,
          quantityDelta: delta,
          quantityBefore: before,
          quantityAfter: after,
          reason: d.reason?.trim() || null,
          orderId: null,
          adminUserId: userId,
          referenceKey: null,
        });
      return { stock: after, idempotent: false };
    });
  }
}
