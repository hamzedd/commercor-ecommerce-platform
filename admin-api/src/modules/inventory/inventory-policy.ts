export const GLOBAL_LOW_STOCK_THRESHOLD = 5;
export const effectiveThreshold = (
  variant: number | null | undefined,
  product: number | null | undefined,
) => variant ?? product ?? GLOBAL_LOW_STOCK_THRESHOLD;
export const stockStatus = (stock: number, threshold: number) =>
  stock === 0 ? 'out_of_stock' : stock <= threshold ? 'low_stock' : 'in_stock';
