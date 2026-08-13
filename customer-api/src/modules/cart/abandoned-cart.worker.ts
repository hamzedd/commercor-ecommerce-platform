import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CartEntity, CartStatus } from '@/src/libs/models/entities/cart/Cart.entity';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { NotificationService } from '@/src/modules/notifications/notification.service';
import { ABANDONED_CART_EMAIL_COOLDOWN_HOURS, ABANDONED_CART_MINUTES, DOMAIN_URL } from '@/src/utils/environmentConstants';
import { isAbandonmentEligible } from './abandoned-cart.policy';

@Injectable()
export class AbandonedCartWorker implements OnApplicationBootstrap, OnApplicationShutdown {
  private timer?: NodeJS.Timeout;
  private running = false;
  constructor(private readonly db: DataSource, private readonly notifications: NotificationService) {}
  onApplicationBootstrap() { this.timer = setInterval(() => void this.runOnce(), 300_000); this.timer.unref(); }
  onApplicationShutdown() { if (this.timer) clearInterval(this.timer); }
  async runOnce(now = new Date(), batch = 25) {
    if (this.running) return 0;
    this.running = true;
    try {
      return await this.db.transaction(async (manager) => {
        const carts = await manager.getRepository(CartEntity).createQueryBuilder('cart')
          .innerJoinAndSelect('cart.items', 'item').setLock('pessimistic_write').setOnLocked('skip_locked')
          .where('cart.status = :status', { status: CartStatus.ACTIVE }).andWhere('cart.checkoutOrderId IS NULL')
          .andWhere('cart.lastActivityAt <= :cutoff', { cutoff: new Date(now.getTime() - ABANDONED_CART_MINUTES * 60_000) })
          .take(batch).getMany();
        let count = 0;
        for (const cart of carts) {
          if (!isAbandonmentEligible({ status: cart.status, lastActivityAt: cart.lastActivityAt, checkoutOrderId: cart.checkoutOrderId, itemCount: cart.items.length, recoveryEmailSentAt: cart.recoveryEmailSentAt }, now, ABANDONED_CART_MINUTES, ABANDONED_CART_EMAIL_COOLDOWN_HOURS)) continue;
          const customer = await manager.getRepository(CustomerEntity).findOneBy({ id: cart.customerId });
          if (!customer) continue;
          cart.status = CartStatus.ABANDONED; cart.abandonedAt = now; cart.recoveryEmailSentAt = now; cart.abandonmentCycle += 1;
          await manager.getRepository(CartEntity).save(cart);
          await this.notifications.queueCustomer(manager, customer, 'abandoned_cart', `abandoned_cart:${cart.id}:${cart.abandonmentCycle}`, { cartUrl: `${(DOMAIN_URL || '').replace(/\/$/, '')}/cart`, itemCount: cart.items.length });
          count++;
        }
        return count;
      });
    } finally { this.running = false; }
  }
}
