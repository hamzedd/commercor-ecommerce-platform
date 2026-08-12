import {calculateEarnings,calculateRedemption,RewardSettings} from './reward-calculator';
const base:RewardSettings={pointsEnabled:true,pointsPerCurrencyUnit:1,pointsPerCurrencyRedemptionUnit:100,minimumPointsToRedeem:100,maximumPointsRedemptionPercent:20,cashbackEnabled:true,cashbackPercent:5,cashbackMinimumOrderAmount:50,cashbackMaximumPerOrder:null,maximumCashbackUsePercent:50};
describe('reward calculator',()=>{
 it('disables earning',()=>expect(calculateEarnings(100,{...base,pointsEnabled:false,cashbackEnabled:false})).toEqual({points:0,cashback:0}));
 it('earns points and cashback',()=>expect(calculateEarnings(100,base)).toEqual({points:100,cashback:5}));
 it('caps cashback earned',()=>expect(calculateEarnings(100,{...base,cashbackMaximumPerOrder:3}).cashback).toBe(3));
 it('enforces cashback minimum order',()=>expect(calculateEarnings(49,base).cashback).toBe(0));
 it('converts and combines redemption',()=>expect(calculateRedemption(100,100,10,500,50,base)).toEqual({pointsRedeemed:100,pointsDiscount:1,cashbackUsed:10,discountedSubtotal:89}));
 it('enforces minimum points',()=>expect(()=>calculateRedemption(100,50,0,500,0,base)).toThrow('Minimum'));
 it('enforces points cap',()=>expect(()=>calculateRedemption(100,2100,0,3000,0,base)).toThrow('order limit'));
 it('rejects insufficient points',()=>expect(()=>calculateRedemption(100,600,0,500,0,base)).toThrow('Insufficient'));
 it('rejects insufficient cashback',()=>expect(()=>calculateRedemption(100,0,51,0,50,base)).toThrow('Insufficient'));
 it('enforces cashback usage cap',()=>expect(()=>calculateRedemption(100,0,51,0,100,base)).toThrow('order limit'));
 it('never produces a negative subtotal',()=>expect(calculateRedemption(100,0,100,0,100,{...base,maximumCashbackUsePercent:100}).discountedSubtotal).toBe(0));
});
