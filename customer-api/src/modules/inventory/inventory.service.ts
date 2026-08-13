import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import {
  InventoryMovementEntity,
  InventoryMovementType,
} from '@/src/libs/models/entities/inventory/InventoryMovement.entity';
@Injectable()
export class InventoryService {
  async change(
    manager: EntityManager,
    input: {
      productId: string;
      variantId?: string | null;
      delta: number;
      type: InventoryMovementType;
      reason?: string | null;
      orderId?: string | null;
      adminUserId?: string | null;
      referenceKey?: string | null;
    },
  ) {
    const movements = manager.getRepository(InventoryMovementEntity);
    if (
      input.referenceKey &&
      (await movements.existsBy({ referenceKey: input.referenceKey }))
    )
      return false;
    const target = input.variantId
      ? await manager
          .getRepository(ProductVariantEntity)
          .findOne({
            where: { id: input.variantId, productId: input.productId },
            lock: { mode: 'pessimistic_write' },
          })
      : await manager
          .getRepository(ProductEntity)
          .findOne({
            where: { id: input.productId },
            lock: { mode: 'pessimistic_write' },
          });
    if (!target) throw new BadRequestException('Inventory target not found');
    const before = target.stock,
      after = before + input.delta;
    if (after < 0)
      throw new BadRequestException('Stock cannot be reduced below zero');
    target.stock = after;
    await manager.save(target);
    await movements.save(
      movements.create({
        productId: input.productId,
        variantId: input.variantId || null,
        type: input.type,
        quantityDelta: input.delta,
        quantityBefore: before,
        quantityAfter: after,
        reason: input.reason || null,
        orderId: input.orderId || null,
        adminUserId: input.adminUserId || null,
        referenceKey: input.referenceKey || null,
      }),
    );
    return true;
  }
}
