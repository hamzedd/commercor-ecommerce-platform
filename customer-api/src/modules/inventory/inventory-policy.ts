export const GLOBAL_LOW_STOCK_THRESHOLD = 5;
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export function effectiveThreshold(
  variantThreshold: number | null | undefined,
  productThreshold: number | null | undefined,
) {
  return variantThreshold ?? productThreshold ?? GLOBAL_LOW_STOCK_THRESHOLD;
}
export function stockStatus(stock: number, threshold: number): StockStatus {
  return stock === 0
    ? 'out_of_stock'
    : stock <= threshold
      ? 'low_stock'
      : 'in_stock';
}
