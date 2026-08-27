import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductsService } from '@/src/modules/product/services/products.service';
import { OrdersService } from '@/src/modules/orders/services/orders.service';
import { CustomersService } from '@/src/modules/customers/services/customers.service';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';

const STOCK_MANAGER_ROLES: string[] = [
  UserRoleEnum.ADMIN,
  UserRoleEnum.STOCK_MANAGER,
];

function clampLimit(limit: number | undefined, fallback = 10, max = 25) {
  return Math.min(Math.max(limit ?? fallback, 1), max);
}

@Injectable()
export class AssistantToolsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly customersService: CustomersService,
  ) {}

  async searchProducts(input: { query: string; limit?: number }) {
    const products = await this.productRepository.find({
      where: { translations: { name: Like(`%${input.query}%`) } },
      relations: ['translations'],
      take: clampLimit(input.limit),
    });
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.translations?.[0]?.name,
        price: product.price,
        stock: product.stock,
      })),
    };
  }

  async getProductDetails(input: { id: string }) {
    try {
      const product = await this.productsService.getProduct(input.id);
      return {
        id: product.id,
        translations: product.translations?.map((t) => ({
          lang: t.lang,
          name: t.name,
          description: t.description,
        })),
        price: product.price,
        stock: product.stock,
      };
    } catch {
      return {
        error: 'not_found',
        message: `No product found with id "${input.id}".`,
      };
    }
  }

  async updateProductStock(
    input: { id: string; stock: number },
    role?: string,
  ) {
    if (!role || !STOCK_MANAGER_ROLES.includes(role)) {
      return {
        error: 'forbidden',
        message: 'Only ADMIN or STOCK_MANAGER staff can update stock.',
      };
    }
    const result = await this.productRepository.update(input.id, {
      stock: input.stock,
    });
    if (!result.affected) {
      return {
        error: 'not_found',
        message: `No product found with id "${input.id}".`,
      };
    }
    return { success: true, id: input.id, stock: input.stock };
  }

  async listOrders(input: { status?: string; limit?: number }) {
    const orders = await this.ordersService.getAllOrders();
    const filtered = input.status
      ? orders.filter((order) => order.status === input.status)
      : orders;
    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return {
      orders: sorted.slice(0, clampLimit(input.limit)).map((order) => ({
        id: order.id,
        status: order.status,
        total: Number(order.productAmount) + Number(order.deliveryAmount),
        placedAt: order.created_at,
        customer: order.customer
          ? `${order.customer.firstName} ${order.customer.lastName}`
          : undefined,
      })),
    };
  }

  async getOrderDetails(input: { id: string }) {
    try {
      const order = await this.ordersService.getOrderById(input.id);
      return {
        id: order.id,
        status: order.status,
        total: Number(order.productAmount) + Number(order.deliveryAmount),
        placedAt: order.created_at,
        customer: order.customer
          ? {
              name: `${order.customer.firstName} ${order.customer.lastName}`,
              email: order.customer.email,
            }
          : undefined,
        items: order.orderItems.map((item) => ({
          product: item.product?.translations?.[0]?.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };
    } catch {
      return {
        error: 'not_found',
        message: `No order found with id "${input.id}".`,
      };
    }
  }

  async getSalesSummary() {
    const orders = await this.ordersService.getAllOrders();
    const revenue = orders.reduce(
      (sum, order) =>
        sum + Number(order.productAmount) + Number(order.deliveryAmount),
      0,
    );
    const statusCounts: Record<string, number> = {};
    for (const order of orders) {
      statusCounts[order.status] = (statusCounts[order.status] ?? 0) + 1;
    }
    return {
      orderCount: orders.length,
      totalRevenue: Number(revenue.toFixed(2)),
      averageOrderValue: orders.length
        ? Number((revenue / orders.length).toFixed(2))
        : 0,
      statusCounts,
    };
  }

  async searchCustomers(input: { query: string; limit?: number }) {
    const customers = await this.customersService.getCustomers();
    const query = input.query.toLowerCase();
    const matches = customers.filter(
      (customer) =>
        customer.firstName?.toLowerCase().includes(query) ||
        customer.lastName?.toLowerCase().includes(query) ||
        customer.username?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query),
    );
    return {
      customers: matches.slice(0, clampLimit(input.limit)).map((customer) => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        username: customer.username,
        email: customer.email,
      })),
    };
  }
}
