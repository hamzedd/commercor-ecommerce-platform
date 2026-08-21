import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, IsNull } from 'typeorm';
import {
  CartEntity,
  CartStatus,
} from '@/src/libs/models/entities/cart/Cart.entity';
import { CartItemEntity } from '@/src/libs/models/entities/cart/CartItem.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import { AddCartItemDto } from './cart.dto';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { PaymentExpirationService } from '../payments/services/payment-expiration.service';

@Injectable()
export class CartService {
  constructor(
    private readonly db: DataSource,
    @Inject(forwardRef(() => PaymentExpirationService))
    private readonly paymentExpiration: PaymentExpirationService,
  ) {}
  private async active(
    manager: EntityManager,
    customerId: string,
    create = true,
  ) {
    let cart = await manager
      .getRepository(CartEntity)
      .findOne({ where: { customerId, status: CartStatus.ACTIVE } });
    if (!cart && create)
      cart = await manager.getRepository(CartEntity).save(
        manager.getRepository(CartEntity).create({
          customerId,
          status: CartStatus.ACTIVE,
          lastActivityAt: new Date(),
          abandonedAt: null,
          recoveredAt: null,
          convertedOrderId: null,
          checkoutOrderId: null,
          recoveryEmailSentAt: null,
          abandonmentCycle: 0,
        }),
      );
    return cart;
  }
  private async validate(manager: EntityManager, data: AddCartItemDto) {
    const product = await manager.getRepository(ProductEntity).findOne({
      where: { id: data.productId },
      relations: { variants: true },
    });
    if (!product) throw new BadRequestException('Product does not exist');
    const enabledVariants = (product.variants || []).filter((v) => v.enabled);
    let variant: ProductVariantEntity | null = null;
    if (data.variantId) {
      variant = enabledVariants.find((v) => v.id === data.variantId) || null;
      if (!variant)
        throw new BadRequestException('Variant does not belong to product');
    } else if (enabledVariants.length)
      throw new BadRequestException('Variant is required for this product');
    const stock = variant ? variant.stock : product.stock;
    if (stock <= 0 || data.quantity > stock)
      throw new BadRequestException('Requested quantity is unavailable');
    return { product, variant, stock };
  }
  async add(customerId: string, data: AddCartItemDto) {
    return this.db.transaction(async (manager) => {
      const { stock } = await this.validate(manager, data);
      const cart = (await this.active(manager, customerId))!;
      await this.assertMutable(manager, cart);
      const repo = manager.getRepository(CartItemEntity);
      const existing = await repo.findOne({
        where: {
          cartId: cart.id,
          productId: data.productId,
          variantId: data.variantId ? data.variantId : IsNull(),
        },
      });
      const quantity = (existing?.quantity || 0) + data.quantity;
      if (quantity > stock)
        throw new BadRequestException('Requested quantity is unavailable');
      await repo.save(
        existing
          ? Object.assign(existing, { quantity })
          : repo.create({
              cartId: cart.id,
              productId: data.productId,
              variantId: data.variantId || null,
              quantity,
            }),
      );
      await this.touch(manager, cart);
      return this.readWith(manager, customerId, false);
    });
  }
  async update(customerId: string, id: string, quantity: number) {
    return this.db.transaction(async (manager) => {
      const cart = await this.active(manager, customerId, false);
      if (!cart) throw new NotFoundException();
      await this.assertMutable(manager, cart);
      const item = await manager
        .getRepository(CartItemEntity)
        .findOneBy({ id, cartId: cart.id });
      if (!item) throw new NotFoundException();
      await this.validate(manager, {
        productId: item.productId,
        variantId: item.variantId,
        quantity,
      });
      item.quantity = quantity;
      await manager.getRepository(CartItemEntity).save(item);
      await this.touch(manager, cart);
      return this.readWith(manager, customerId, false);
    });
  }
  async remove(customerId: string, id: string) {
    return this.db.transaction(async (manager) => {
      const cart = await this.active(manager, customerId, false);
      if (!cart) throw new NotFoundException();
      await this.assertMutable(manager, cart);
      const result = await manager
        .getRepository(CartItemEntity)
        .softDelete({ id, cartId: cart.id });
      if (!result.affected) throw new NotFoundException();
      await this.touch(manager, cart);
      return this.readWith(manager, customerId, false);
    });
  }
  async clear(customerId: string) {
    return this.db.transaction(async (manager) => {
      const cart = await this.active(manager, customerId, false);
      if (cart) {
        await this.assertMutable(manager, cart);
        await manager
          .getRepository(CartItemEntity)
          .softDelete({ cartId: cart.id });
        await this.touch(manager, cart);
      }
      return this.readWith(manager, customerId, false);
    });
  }
  private async touch(manager: EntityManager, cart: CartEntity) {
    cart.lastActivityAt = new Date();
    cart.abandonedAt = null;
    await manager.getRepository(CartEntity).save(cart);
  }
  async read(customerId: string) {
    return this.db.transaction((manager) =>
      this.readWith(manager, customerId, true),
    );
  }
  private async readWith(
    manager: EntityManager,
    customerId: string,
    recover: boolean,
  ) {
    let cart = await this.active(manager, customerId, false);
    if (!cart && recover)
      cart = await manager.getRepository(CartEntity).findOne({
        where: { customerId, status: CartStatus.ABANDONED },
        order: { abandonedAt: 'DESC' },
      });
    if (!cart) cart = await this.active(manager, customerId, true);
    if (!cart) throw new NotFoundException();
    if (recover && cart.status === CartStatus.ABANDONED) {
      cart.status = CartStatus.ACTIVE;
      cart.recoveredAt = new Date();
      cart.lastActivityAt = new Date();
      cart.abandonedAt = null;
      cart.checkoutOrderId = null;
      cart = await manager.getRepository(CartEntity).save(cart);
    }
    await this.reconcileCheckout(manager, cart);
    const items = await manager
      .getRepository(CartItemEntity)
      .find({ where: { cartId: cart.id } });
    const resolved = await Promise.all(
      items.map(async (item) => {
        const product = await manager.getRepository(ProductEntity).findOne({
          where: { id: item.productId },
          relations: { translations: true, images: true, variants: true },
        });
        const variant = item.variantId
          ? product?.variants?.find((v) => v.id === item.variantId && v.enabled)
          : null;
        const variantMissing = !!item.variantId && !variant;
        const requiresVariant =
          !item.variantId && !!product?.variants?.some((v) => v.enabled);
        const stock = variant ? variant.stock : product?.stock || 0;
        const available =
          !!product && !variantMissing && !requiresVariant && stock > 0;
        return {
          id: item.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          available,
          unavailableReason: !product
            ? 'product_missing'
            : variantMissing
              ? 'variant_missing'
              : requiresVariant
                ? 'variant_required'
                : stock <= 0
                  ? 'out_of_stock'
                  : null,
          name: product?.translations?.[0]?.name || 'Unavailable item',
          image: variant?.image || product?.images?.[0]?.name || null,
          effectivePrice: available
            ? Number(variant?.priceOverride ?? product?.price)
            : null,
          stock,
          variantDescription: variant ? variant.combinationKey : null,
        };
      }),
    );
    const pendingOrder = cart.checkoutOrderId
      ? await manager.getRepository(OrderEntity).findOne({
          where: { id: cart.checkoutOrderId, customerId },
          select: { id: true, paymentId: true },
        })
      : null;
    return {
      id: cart.id,
      status: cart.status,
      lastActivityAt: cart.lastActivityAt,
      recoveredAt: cart.recoveredAt,
      checkoutPending: !!cart.checkoutOrderId,
      pendingPaymentId: pendingOrder?.paymentId || null,
      estimatedValue: resolved.reduce(
        (sum, item) => sum + (item.effectivePrice || 0) * item.quantity,
        0,
      ),
      items: resolved,
    };
  }
  async linkCheckout(
    manager: EntityManager,
    customerId: string,
    orderId: string,
  ) {
    const cart = await this.active(manager, customerId, false);
    if (cart) {
      cart.checkoutOrderId = orderId;
      await manager.getRepository(CartEntity).save(cart);
    }
  }
  async convert(manager: EntityManager, customerId: string, orderId: string) {
    const cart = await manager.getRepository(CartEntity).findOne({
      where: {
        customerId,
        status: CartStatus.ACTIVE,
        checkoutOrderId: orderId,
      },
    });
    if (cart) {
      cart.status = CartStatus.CONVERTED;
      cart.convertedOrderId = orderId;
      cart.checkoutOrderId = null;
      await manager.getRepository(CartEntity).save(cart);
    }
  }
  async releaseCheckout(
    manager: EntityManager,
    customerId: string,
    orderId: string,
  ) {
    const cart = await manager.getRepository(CartEntity).findOne({
      where: {
        customerId,
        status: CartStatus.ACTIVE,
        checkoutOrderId: orderId,
      },
    });
    if (cart) {
      cart.checkoutOrderId = null;
      cart.lastActivityAt = new Date();
      await manager.getRepository(CartEntity).save(cart);
    }
  }

  private async assertMutable(manager: EntityManager, cart: CartEntity) {
    if (await this.reconcileCheckout(manager, cart)) {
      throw new BadRequestException('Cart has a pending checkout');
    }
  }

  private async reconcileCheckout(
    manager: EntityManager,
    cart: CartEntity,
  ): Promise<boolean> {
    if (!cart.checkoutOrderId) return false;
    const active = await this.paymentExpiration.reconcileCheckout(
      manager,
      cart.customerId,
      cart.checkoutOrderId,
    );
    if (!active) cart.checkoutOrderId = null;
    return active;
  }
}
