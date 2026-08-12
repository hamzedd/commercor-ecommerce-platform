import {calculateCouponDiscount} from './coupon-calculator'; import {calculateAmounts} from './pricing-calculator';
describe('coupon pricing',()=>{
 it('calculates percentage money-safely',()=>expect(calculateCouponDiscount(99.99,{type:'percentage',value:10})).toBe(10));
 it('calculates fixed coupons',()=>expect(calculateCouponDiscount(100,{type:'fixed',value:15})).toBe(15));
 it('caps percentage discounts',()=>expect(calculateCouponDiscount(200,{type:'percentage',value:50,maximumDiscountAmount:30})).toBe(30));
 it('never exceeds subtotal',()=>expect(calculateCouponDiscount(10,{type:'fixed',value:50})).toBe(10));
 it('preserves shipping threshold semantics while discounting taxable spend',()=>expect(calculateAmounts(100,'US',{shippingEnabled:true,defaultShippingFee:10,freeShippingThreshold:100},null,80)).toMatchObject({shippingAmount:0,total:80}));
 it('calculates exclusive tax after coupon',()=>expect(calculateAmounts(100,'US',{taxEnabled:true,defaultTaxRate:20,pricesIncludeTax:false},null,80)).toMatchObject({taxAmount:16,total:96}));
 it('extracts inclusive tax after coupon without adding tax',()=>expect(calculateAmounts(120,'US',{taxEnabled:true,defaultTaxRate:20,pricesIncludeTax:true},null,96)).toMatchObject({taxAmount:16,total:96}));
});
