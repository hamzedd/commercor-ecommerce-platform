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
import { ProductVariantEntity } from '@/src/libs/models/entities/product/ProductVariant.entity';
import { effectiveVariantPrice } from './variant-pricing';
import { PromotionEntity, PromotionStatus } from '@/src/libs/models/entities/promotion/Promotion.entity';
import { PromotionProductEntity } from '@/src/libs/models/entities/promotion/PromotionProduct.entity';
import { PromotionCategoryEntity } from '@/src/libs/models/entities/promotion/PromotionCategory.entity';
import { PromotionUsageEntity } from '@/src/libs/models/entities/promotion/PromotionUsage.entity';
import { calculatePromotions, PromotionRule } from './promotion-calculator';

export type PricingResult = { subtotal: number; coupon:CouponEntity|null; couponCode:string|null; couponDiscount:number; promotions:Array<{id:string;name:string;type:any;discountAmount:number;shippingDiscount:number}>;merchandiseDiscount:number;shippingDiscount:number;totalPromotionDiscount:number;pointsRedeemed:number;pointsDiscount:number;cashbackUsed:number;discountedSubtotal:number;shippingAmount: number; taxAmount: number; total: number; currencyCode: string; pricesIncludeTax: boolean; items: Array<{ product: ProductEntity; variant:ProductVariantEntity|null; variantDescription:string|null; quantity: number; unitPrice: number }> };
@Injectable()
export class PricingService {
  constructor(private readonly rewards:RewardsService){}
  async calculate(manager: EntityManager, requestedItems: CreateOrderItemDto[], country: string, customerId:string, usePoints=0, useCashback=0, couponCode?:string, lockProducts = false): Promise<PricingResult> {
    const quantities = new Map<string, {productId:string;variantId?:string;quantity:number}>();
    for (const item of requestedItems){const key=`${item.productId}:${item.variantId||''}`;const old=quantities.get(key);quantities.set(key,{productId:item.productId,variantId:item.variantId,quantity:(old?.quantity||0)+item.quantity});}
    const ids = [...new Set([...quantities.values()].map(v=>v.productId))];
    const products = await manager.getRepository(ProductEntity).find({ where: { id: In(ids) }, ...(lockProducts ? { lock: { mode: 'pessimistic_write' as const } } : {}) });
    if (products.length !== ids.length) {
      const found = new Set(products.map((product) => product.id));
      throw new NotFoundException(`Product not found: ${ids.find((id) => !found.has(id))}`);
    }
    const byId=new Map(products.map(p=>[p.id,p])); const items=[] as PricingResult['items'];
    for(const requested of quantities.values()) {
      const product=byId.get(requested.productId)!; const quantity=requested.quantity;
      if (!Number.isInteger(quantity) || quantity < 1) throw new BadRequestException(`Invalid quantity for product ${product.id}`);
      const variantCount=await manager.getRepository(ProductVariantEntity).countBy({productId:product.id}); let variant:ProductVariantEntity|null=null;let description:string|null=null;
      if(variantCount){if(!requested.variantId)throw new BadRequestException(`Variant is required for product ${product.id}`);variant=await manager.getRepository(ProductVariantEntity).findOne({where:{id:requested.variantId,productId:product.id},relations:{values:{optionValue:{option:true}}},...(lockProducts?{lock:{mode:'pessimistic_write' as const}}:{})});if(!variant)throw new BadRequestException('Invalid variant for product');if(!variant.enabled)throw new BadRequestException('Selected variant is disabled');if(variant.stock<quantity)throw new BadRequestException('Selected variant is out of stock');description=variant.values.sort((a,b)=>a.optionValue.option.position-b.optionValue.option.position).map(v=>v.optionValue.value).join(' / ');}else{if(requested.variantId)throw new BadRequestException('Product does not have variants');if(product.stock<quantity)throw new BadRequestException(`Not enough stock for product ${product.id}`);}
      items.push({product,variant,variantDescription:description,quantity,unitPrice:effectiveVariantPrice(Number(product.price),variant?.priceOverride)});
    }
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const entered=couponCode?.trim().toUpperCase();const codePromotion=entered?await manager.getRepository(PromotionEntity).findOne({where:{code:entered},...(lockProducts?{lock:{mode:'pessimistic_write' as const}}:{})}):null;
    const coupon = codePromotion?null:await this.validateCoupon(manager, couponCode, subtotal, customerId, lockProducts);
    const couponDiscount = coupon ? calculateCouponDiscount(subtotal,{type:coupon.type,value:Number(coupon.value),maximumDiscountAmount:coupon.maximumDiscountAmount==null?null:Number(coupon.maximumDiscountAmount)}) : 0;
    const normalizedCountry = country.trim().toUpperCase();
    const settings = await manager.getRepository(CommerceSettingsEntity).findOne({ where: {} });
    const rule = normalizedCountry.length === 2 ? await manager.getRepository(CommerceCountryRuleEntity).findOneBy({ countryCode: normalizedCountry }) : null;
    const baseAmounts=calculateAmounts(subtotal,normalizedCountry,settings,rule,subtotal);const eligible=await this.eligiblePromotions(manager,subtotal,customerId,codePromotion,lockProducts);const promotionResult=calculatePromotions(subtotal,items.map(i=>({productId:i.product.id,categoryId:i.product.categoryId,quantity:i.quantity,unitPrice:i.unitPrice})),eligible,baseAmounts.shippingAmount);
    const couponAdjustedSubtotal = Number((promotionResult.discountedSubtotal - couponDiscount).toFixed(2));
    const rewardSettings=await this.rewards.settings(manager); const account=await this.rewards.account(manager,customerId,lockProducts);
    let redemption; try{redemption=calculateRedemption(couponAdjustedSubtotal,usePoints,useCashback,account.pointsBalance,Number(account.cashbackBalance),rewardSettings);}catch(e){throw new BadRequestException((e as Error).message);}
    const amounts = calculateAmounts(subtotal, normalizedCountry, settings, rule, redemption.discountedSubtotal);amounts.shippingAmount=Number(Math.max(0,amounts.shippingAmount-promotionResult.shippingDiscount).toFixed(2));amounts.total=Number((redemption.discountedSubtotal+amounts.shippingAmount+(amounts.pricesIncludeTax?0:amounts.taxAmount)).toFixed(2));
    const currency = await manager.getRepository(CompanyDetailEntity).findOneBy({ key: 'currency_code' });
    return { ...amounts, subtotal:Number(subtotal.toFixed(2)), coupon, couponCode:coupon?.code||codePromotion?.code||null, couponDiscount, ...promotionResult,discountedSubtotal:redemption.discountedSubtotal,...redemption, currencyCode: currency?.value || 'USD', items };
  }

  private async eligiblePromotions(manager:EntityManager,subtotal:number,customerId:string,code:PromotionEntity|null,lock:boolean){const now=new Date();const all=await manager.getRepository(PromotionEntity).find({where:{status:PromotionStatus.ACTIVE},...(lock?{lock:{mode:'pessimistic_write' as const}}:{})});const candidates=all.filter(p=>(p.automatic||p.id===code?.id)&&(!p.startsAt||p.startsAt<=now)&&(!p.endsAt||p.endsAt>now)&&(p.minimumSubtotal==null||subtotal>=Number(p.minimumSubtotal)));if(code&&!candidates.some(p=>p.id===code.id))throw new BadRequestException(code.endsAt&&code.endsAt<=now?'Promotion has expired':'Promotion is unavailable');const result:PromotionRule[]=[];for(const p of candidates){const used=await manager.getRepository(PromotionUsageEntity).countBy({promotionId:p.id});const customerUsed=await manager.getRepository(PromotionUsageEntity).countBy({promotionId:p.id,customerId});const pending=await manager.getRepository(OrderEntity).createQueryBuilder('o').where('o.status=:status',{status:OrderStatus.PENDING}).andWhere(`o."promotionSnapshot" @> :snapshot`,{snapshot:JSON.stringify([{id:p.id}])}).getCount();if(p.usageLimit!=null&&used+pending>=p.usageLimit)continue;if(p.usagePerCustomer!=null&&customerUsed>=p.usagePerCustomer)continue;const[ps,cs]=await Promise.all([manager.getRepository(PromotionProductEntity).findBy({promotionId:p.id}),manager.getRepository(PromotionCategoryEntity).findBy({promotionId:p.id})]);result.push({...p,discountValue:Number(p.discountValue),maximumDiscount:p.maximumDiscount==null?null:Number(p.maximumDiscount),getDiscountPercent:p.getDiscountPercent==null?null:Number(p.getDiscountPercent),productIds:new Set(ps.map(x=>x.productId)),categoryIds:new Set(cs.map(x=>x.categoryId))})}if(code&&!result.some(p=>p.id===code.id))throw new BadRequestException('Promotion usage limit has been reached');return result}

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
