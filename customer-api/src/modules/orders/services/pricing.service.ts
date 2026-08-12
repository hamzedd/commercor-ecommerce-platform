import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { CommerceSettingsEntity } from '@/src/libs/models/entities/commerce/CommerceSettings.entity';
import { CommerceCountryRuleEntity } from '@/src/libs/models/entities/commerce/CommerceCountryRule.entity';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { CreateOrderItemDto } from '@/src/libs/models/dtos/orders/CreateOrderItem.dto';
import { calculateAmounts } from './pricing-calculator';

export type PricingResult = { subtotal: number; shippingAmount: number; taxAmount: number; total: number; currencyCode: string; pricesIncludeTax: boolean; items: Array<{ product: ProductEntity; quantity: number; unitPrice: number }> };
@Injectable()
export class PricingService {
  async calculate(manager: EntityManager, requestedItems: CreateOrderItemDto[], country: string, lockProducts = false): Promise<PricingResult> {
    const quantities = new Map<string, number>();
    for (const item of requestedItems) quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    const ids = [...quantities.keys()];
    const products = await manager.getRepository(ProductEntity).find({ where: { id: In(ids) }, ...(lockProducts ? { lock: { mode: 'pessimistic_write' as const } } : {}) });
    if (products.length !== ids.length) {
      const found = new Set(products.map((product) => product.id));
      throw new NotFoundException(`Product not found: ${ids.find((id) => !found.has(id))}`);
    }
    const items = products.map((product) => {
      const quantity = quantities.get(product.id)!;
      if (!Number.isInteger(quantity) || quantity < 1) throw new BadRequestException(`Invalid quantity for product ${product.id}`);
      if (product.stock < quantity) throw new BadRequestException(`Not enough stock for product ${product.id}`);
      return { product, quantity, unitPrice: Number(product.price) };
    });
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const normalizedCountry = country.trim().toUpperCase();
    const settings = await manager.getRepository(CommerceSettingsEntity).findOne({ where: {} });
    const rule = normalizedCountry.length === 2 ? await manager.getRepository(CommerceCountryRuleEntity).findOneBy({ countryCode: normalizedCountry }) : null;
    const amounts = calculateAmounts(subtotal, normalizedCountry, settings, rule);
    const currency = await manager.getRepository(CompanyDetailEntity).findOneBy({ key: 'currency_code' });
    return { ...amounts, currencyCode: currency?.value || 'USD', items };
  }
}
