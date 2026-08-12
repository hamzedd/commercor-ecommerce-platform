import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { CommerceSettingsEntity } from '@/src/libs/models/entities/commerce/CommerceSettings.entity';
import { CommerceCountryRuleEntity } from '@/src/libs/models/entities/commerce/CommerceCountryRule.entity';
import { CompanyDetailEntity } from '@/src/libs/models/entities/company/CompanyDetail.entity';
import { CreateOrderItemDto } from '@/src/libs/models/dtos/orders/CreateOrderItem.dto';
import { calculateAmounts } from './pricing-calculator';
import { RewardsService } from '@/src/modules/rewards/rewards.service';
import { calculateRedemption } from '@/src/modules/rewards/reward-calculator';
import { CouponEntity } from '@/src/libs/models/entities/coupon/Coupon.entity';
import { CouponUsageEntity } from '@/src/libs/models/entities/coupon/CouponUsage.entity';
import { OrderEntity } from '@/src/libs/models/entities/order/Order.entity';
import { OrderStatus } from '@/src/utils/enums/PaymentEnums';
import { calculateCouponDiscount } from './coupon-calculator';

export type PricingResult = { subtotal: number; coupon:CouponEntity|null; couponCode:string|null; couponDiscount:number; pointsRedeemed:number; pointsDiscount:number; cashbackUsed:number; discountedSubtotal:number; shippingAmount: number; taxAmount: number; total: number; currencyCode: string; pricesIncludeTax: boolean; items: Array<{ product: ProductEntity; quantity: number; unitPrice: number }> };
@Injectable()
export class PricingService {
  constructor(private readonly rewards:RewardsService){}
  async calculate(manager: EntityManager, requestedItems: CreateOrderItemDto[], country: string, customerId:string, usePoints=0, useCashback=0, couponCode?:string, lockProducts = false): Promise<PricingResult> {
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
    const coupon = await this.validateCoupon(manager, couponCode, subtotal, customerId, lockProducts);
    const couponDiscount = coupon ? calculateCouponDiscount(subtotal,{type:coupon.type,value:Number(coupon.value),maximumDiscountAmount:coupon.maximumDiscountAmount==null?null:Number(coupon.maximumDiscountAmount)}) : 0;
    const couponAdjustedSubtotal = Number((subtotal - couponDiscount).toFixed(2));
    const normalizedCountry = country.trim().toUpperCase();
    const settings = await manager.getRepository(CommerceSettingsEntity).findOne({ where: {} });
    const rule = normalizedCountry.length === 2 ? await manager.getRepository(CommerceCountryRuleEntity).findOneBy({ countryCode: normalizedCountry }) : null;
    const rewardSettings=await this.rewards.settings(manager); const account=await this.rewards.account(manager,customerId,lockProducts);
    let redemption; try{redemption=calculateRedemption(couponAdjustedSubtotal,usePoints,useCashback,account.pointsBalance,Number(account.cashbackBalance),rewardSettings);}catch(e){throw new BadRequestException((e as Error).message);}
    const amounts = calculateAmounts(subtotal, normalizedCountry, settings, rule, redemption.discountedSubtotal);
    const currency = await manager.getRepository(CompanyDetailEntity).findOneBy({ key: 'currency_code' });
    return { ...amounts, subtotal:Number(subtotal.toFixed(2)), coupon, couponCode:coupon?.code || null, couponDiscount, ...redemption, currencyCode: currency?.value || 'USD', items };
  }

  private async validateCoupon(manager:EntityManager, entered:string|undefined, subtotal:number, customerId:string, lock:boolean){
    const code=entered?.trim().toUpperCase(); if(!code)return null;
    const coupon=await manager.getRepository(CouponEntity).findOne({where:{code},...(lock?{lock:{mode:'pessimistic_write' as const}}:{})});
    if(!coupon)throw new BadRequestException('Coupon code is invalid'); const now=new Date();
    if(!coupon.enabled)throw new BadRequestException('Coupon is disabled'); if(coupon.startsAt&&coupon.startsAt>now)throw new BadRequestException('Coupon is not active yet'); if(coupon.expiresAt&&coupon.expiresAt<=now)throw new BadRequestException('Coupon has expired');
    if(coupon.minimumOrderAmount!=null&&subtotal<Number(coupon.minimumOrderAmount))throw new BadRequestException(`Coupon requires a minimum order of ${Number(coupon.minimumOrderAmount).toFixed(2)}`);
    const used=await manager.getRepository(CouponUsageEntity).countBy({couponId:coupon.id});
    const pending=await manager.getRepository(OrderEntity).count({where:{couponId:coupon.id,status:OrderStatus.PENDING}});
    if(coupon.usageLimit!=null&&used+pending>=coupon.usageLimit)throw new BadRequestException('Coupon usage limit has been reached');
    const customerUsed=await manager.getRepository(CouponUsageEntity).countBy({couponId:coupon.id,customerId});
    const customerPending=await manager.getRepository(OrderEntity).count({where:{couponId:coupon.id,customerId,status:OrderStatus.PENDING}});
    if(coupon.usageLimitPerCustomer!=null&&customerUsed+customerPending>=coupon.usageLimitPerCustomer)throw new BadRequestException('Coupon customer usage limit has been reached'); return coupon;
  }
}
