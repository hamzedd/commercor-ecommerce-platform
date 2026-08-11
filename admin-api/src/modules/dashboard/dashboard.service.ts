import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderItemEntity } from '@/src/libs/models/entities/order/OrderItem.entity';
import { PaymentEntity } from '@/src/libs/models/entities/payment/Payment.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

const excludedStatuses = ['cancelled', 'canceled', 'failed', 'declined'];

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getDashboard() {
    const weekStart = this.getCurrentWeekStart();
    const [
      totalOrders,
      pendingOrders,
      lowStockProducts,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({
        where: [{ status: 'pending' }, { status: 'processing' }],
      }),
      this.productRepository.count({
        where: { stock: LessThanOrEqual(5) },
      }),
      this.paymentRepository
        .createQueryBuilder('payment')
        .innerJoin(OrderEntity, 'order', 'order.paymentId = payment.id')
        .select(
          'COALESCE(SUM(GREATEST(COALESCE(order.productAmount, 0) + COALESCE(order.deliveryAmount, 0) - COALESCE(payment.refundedAmount, 0), 0)), 0)',
          'revenue',
        )
        .where('payment.status = :paymentStatus', {
          paymentStatus: 'completed',
        })
        .andWhere('payment.created_at >= :weekStart', { weekStart })
        .andWhere('LOWER(order.status) NOT IN (:...excludedStatuses)', {
          excludedStatuses,
        })
        .andWhere('LOWER(payment.status) NOT IN (:...excludedStatuses)', {
          excludedStatuses,
        })
        .getRawOne<{ revenue: string | number | null }>(),
      this.orderRepository.find({
        relations: {
          customer: true,
          payment: true,
        },
        order: { created_at: 'DESC' },
        take: 6,
      }),
    ]);

    const itemCounts = await this.getItemCounts(
      recentOrders.map((order) => order.id),
    );

    return {
      totalOrders,
      pendingOrders,
      lowStockProducts,
      revenueThisWeek: Math.max(Number(revenueResult?.revenue || 0), 0),
      recentOrders: recentOrders.map((order) => {
        const customerName = [
          order.customer?.firstName,
          order.customer?.lastName,
        ]
          .filter(Boolean)
          .join(' ');
        const refundedAmount = Number(order.payment?.refundedAmount || 0);

        return {
          id: order.id,
          reference: order.id,
          customerName: customerName || order.customer?.username || null,
          customerEmail: order.customer?.email || null,
          itemCount: itemCounts.get(order.id) || 0,
          status: order.status,
          createdAt: order.created_at,
          totalAmount: Math.max(
            Number(order.productAmount || 0) +
              Number(order.deliveryAmount || 0) -
              refundedAmount,
            0,
          ),
        };
      }),
    };
  }

  private getCurrentWeekStart() {
    const now = new Date();
    const daysSinceMonday = (now.getUTCDay() + 6) % 7;
    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - daysSinceMonday,
      ),
    );
  }

  private async getItemCounts(orderIds: string[]) {
    if (orderIds.length === 0) return new Map<string, number>();

    const rows = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('item.orderId', 'orderId')
      .addSelect('COALESCE(SUM(item.quantity), 0)', 'itemCount')
      .where({ orderId: In(orderIds) })
      .groupBy('item.orderId')
      .getRawMany<{ orderId: string; itemCount: string | number }>();

    return new Map(
      rows.map((row) => [row.orderId, Number(row.itemCount || 0)]),
    );
  }
}
