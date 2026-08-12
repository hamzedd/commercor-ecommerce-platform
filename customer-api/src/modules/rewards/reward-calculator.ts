export type RewardSettings = { pointsEnabled: boolean; pointsPerCurrencyUnit: number; pointsPerCurrencyRedemptionUnit: number; minimumPointsToRedeem: number; maximumPointsRedemptionPercent: number; cashbackEnabled: boolean; cashbackPercent: number; cashbackMinimumOrderAmount: number; cashbackMaximumPerOrder: number | null; maximumCashbackUsePercent: number };
const money = (v: number) => Number(v.toFixed(2));
export function calculateRedemption(subtotal: number, usePoints: number, useCashback: number, pointsBalance: number, cashbackBalance: number, s: RewardSettings) {
  if (!Number.isInteger(usePoints) || usePoints < 0 || useCashback < 0) throw new Error('Reward amounts must be non-negative.');
  if (usePoints > 0 && !s.pointsEnabled) throw new Error('Points redemption is disabled.');
  if (usePoints > pointsBalance) throw new Error('Insufficient points balance.');
  if (usePoints > 0 && usePoints < s.minimumPointsToRedeem) throw new Error(`Minimum points redemption is ${s.minimumPointsToRedeem}.`);
  const requestedPointsDiscount = money(usePoints / s.pointsPerCurrencyRedemptionUnit);
  const pointsCap = money(subtotal * s.maximumPointsRedemptionPercent / 100);
  if (requestedPointsDiscount > pointsCap) throw new Error('Points redemption exceeds the order limit.');
  const afterPoints = money(subtotal - requestedPointsDiscount);
  if (useCashback > 0 && !s.cashbackEnabled) throw new Error('Cashback usage is disabled.');
  if (useCashback > cashbackBalance) throw new Error('Insufficient cashback balance.');
  const cashbackCap = money(afterPoints * s.maximumCashbackUsePercent / 100);
  if (useCashback > cashbackCap) throw new Error('Cashback usage exceeds the order limit.');
  const cashbackUsed = money(useCashback);
  return { pointsRedeemed: usePoints, pointsDiscount: requestedPointsDiscount, cashbackUsed, discountedSubtotal: money(Math.max(0, afterPoints - cashbackUsed)) };
}
export function calculateEarnings(eligibleSpend: number, s: RewardSettings) {
  const points = s.pointsEnabled ? Math.floor(eligibleSpend * s.pointsPerCurrencyUnit) : 0;
  let cashback = s.cashbackEnabled && eligibleSpend >= s.cashbackMinimumOrderAmount ? money(eligibleSpend * s.cashbackPercent / 100) : 0;
  if (s.cashbackMaximumPerOrder != null) cashback = Math.min(cashback, s.cashbackMaximumPerOrder);
  return { points, cashback: money(cashback) };
}
