import { Injectable } from '@nestjs/common';
import type { PaginateQuery } from 'nestjs-paginate';
import { ProductsService } from '@/src/modules/products/services/products.service';
import { CategoriesService } from '@/src/modules/categories/services/categories.service';
import { OrdersService } from '@/src/modules/orders/services/orders.service';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

function pickTranslation<T extends { lang: string }>(
  translations: T[] | undefined,
  locale?: string,
): T | undefined {
  if (!translations?.length) return undefined;
  return (
    translations.find((t) => t.lang === locale) ??
    translations.find((t) => t.lang === 'en') ??
    translations[0]
  );
}

/**
 * Executes the server-side tools the assistant can call. Client-side tools
 * (cart mutations, navigation) are executed by the frontend instead - see
 * assistant.tools.ts for the full split.
 */
@Injectable()
export class AssistantToolsService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly ordersService: OrdersService,
  ) {}

  async searchProducts(
    input: { query: string; limit?: number },
    locale?: string,
  ) {
    const query: PaginateQuery = {
      path: '',
      search: input.query,
      limit: Math.min(Math.max(input.limit ?? 6, 1), 15),
      page: 1,
    };
    const result = await this.productsService.getProducts({
      query,
      data: { productFilterValues: [] },
    });
    return {
      products: result.data.map((product) =>
        this.summarizeProduct(product, locale),
      ),
    };
  }

  async getProductDetails(input: { slug: string }, locale?: string) {
    const product = await this.productsService.getProductBySlug(input.slug);
    if (!product) {
      return {
        error: 'not_found',
        message: `No product found with slug "${input.slug}".`,
      };
    }
    const translation = pickTranslation(product.translations, locale);
    return {
      id: product.id,
      slug: translation?.slug,
      name: translation?.name,
      description: translation?.description,
      price: product.price,
      stock: product.stock,
      inStock: product.stock > 0,
    };
  }

  async listCategories(locale?: string) {
    const categories = await this.categoriesService.getCategories();
    return {
      categories: categories.map((category) => {
        const translation = pickTranslation(category.translations, locale);
        return {
          id: category.id,
          slug: translation?.slug,
          name: translation?.name,
        };
      }),
    };
  }

  async getOrderStatus(customerId?: string, locale?: string) {
    if (!customerId) {
      return {
        error: 'not_authenticated',
        message:
          'The customer is not logged in - tell them to sign in to check their orders.',
      };
    }
    const orders = await this.ordersService.getCustomerOrders(customerId);
    return {
      orders: orders.slice(0, 10).map((order) => ({
        id: order.id,
        status: order.status,
        total: Number(order.productAmount) + Number(order.deliveryAmount),
        placedAt: order.created_at,
        items: order.orderItems.map((item) => ({
          product: pickTranslation(item.product?.translations, locale)?.name,
          quantity: item.quantity,
        })),
      })),
    };
  }

  private summarizeProduct(product: ProductEntity, locale?: string) {
    const translation = pickTranslation(product.translations, locale);
    return {
      id: product.id,
      slug: translation?.slug,
      name: translation?.name,
      price: product.price,
      stock: product.stock,
      inStock: product.stock > 0,
    };
  }
}
