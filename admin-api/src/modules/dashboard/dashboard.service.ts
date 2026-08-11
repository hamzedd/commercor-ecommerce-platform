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
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
    const [
      totalOrders,
      pendingOrders,
      lowStockProducts,
      weeklyRevenueRows,
      orderStatusRows,
      topSellingProducts,
      recentOrders,
    ] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({
        where: [{ status: 'pending' }, { status: 'processing' }],
      }),
      this.productRepository.count({
        where: { stock: LessThanOrEqual(5) },
      }),
      this.getWeeklyRevenueRows(weekStart, weekEnd),
      this.getOrderStatusBreakdown(),
      this.getTopSellingProducts(),
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
    const weeklyRevenue = this.normalizeWeeklyRevenue(
      weekStart,
      weeklyRevenueRows,
    );

    return {
      totalOrders,
      pendingOrders,
      lowStockProducts,
      revenueThisWeek: Math.max(
        weeklyRevenue.reduce((total, day) => total + day.revenue, 0),
        0,
      ),
      weeklyRevenue,
      orderStatusBreakdown: orderStatusRows.map((row) => ({
        status: row.status,
        count: Number(row.count || 0),
      })),
      topSellingProducts,
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

  private getWeeklyRevenueRows(weekStart: Date, weekEnd: Date) {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin(OrderEntity, 'order', 'order.paymentId = payment.id')
      .select(
        "TO_CHAR(payment.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD')",
        'date',
      )
      .addSelect(
        'COALESCE(SUM(GREATEST(COALESCE(order.productAmount, 0) + COALESCE(order.deliveryAmount, 0) - COALESCE(payment.refundedAmount, 0), 0)), 0)',
        'revenue',
      )
      .where('payment.status = :paymentStatus', {
        paymentStatus: 'completed',
      })
      .andWhere('payment.created_at >= :weekStart', { weekStart })
      .andWhere('payment.created_at < :weekEnd', { weekEnd })
      .andWhere('LOWER(order.status) NOT IN (:...excludedStatuses)', {
        excludedStatuses,
      })
      .andWhere('LOWER(payment.status) NOT IN (:...excludedStatuses)', {
        excludedStatuses,
      })
      .groupBy(
        "TO_CHAR(payment.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD')",
      )
      .getRawMany<{ date: string; revenue: string | number }>();
  }

  private getOrderStatusBreakdown() {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .orderBy('COUNT(order.id)', 'DESC')
      .getRawMany<{ status: string; count: string | number }>();
  }

  private async getTopSellingProducts() {
    const sales = await this.orderItemRepository
      .createQueryBuilder('item')
      .innerJoin(OrderEntity, 'order', 'order.id = item.orderId')
      .select('item.productId', 'productId')
      .addSelect('COALESCE(SUM(item.quantity), 0)', 'quantitySold')
      .addSelect(
        'COALESCE(SUM(item.quantity * item.unitPrice), 0)',
        'revenue',
      )
      .where('LOWER(order.status) NOT IN (:...excludedStatuses)', {
        excludedStatuses,
      })
      .groupBy('item.productId')
      .orderBy('SUM(item.quantity)', 'DESC')
      .addOrderBy('SUM(item.quantity * item.unitPrice)', 'DESC')
      .limit(5)
      .getRawMany<{
        productId: string;
        quantitySold: string | number;
        revenue: string | number;
      }>();

    if (sales.length === 0) return [];

    const products = await this.productRepository.find({
      where: { id: In(sales.map((sale) => sale.productId)) },
      relations: {
        translations: true,
        images: true,
      },
    });
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    return sales.map((sale) => {
      const product = productsById.get(sale.productId);
      const translation =
        product?.translations?.find(
          (item) => item.lang?.toLowerCase() === 'en',
        ) || product?.translations?.[0];

      return {
        productId: sale.productId,
        name: translation?.name || sale.productId,
        quantitySold: Number(sale.quantitySold || 0),
        revenue: Math.max(Number(sale.revenue || 0), 0),
        image: product?.images?.[0]?.name || undefined,
      };
    });
  }

  private normalizeWeeklyRevenue(
    weekStart: Date,
    rows: { date: string; revenue: string | number }[],
  ) {
    const revenueByDate = new Map(
      rows.map((row) => [row.date, Math.max(Number(row.revenue || 0), 0)]),
    );
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return dayLabels.map((day, index) => {
      const date = new Date(weekStart);
      date.setUTCDate(date.getUTCDate() + index);
      const dateString = date.toISOString().slice(0, 10);

      return {
        day,
        date: dateString,
        revenue: revenueByDate.get(dateString) || 0,
      };
    });
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
