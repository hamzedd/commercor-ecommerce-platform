export type PricingSettings = {
  shippingEnabled?: boolean;
  defaultShippingFee?: number;
  freeShippingThreshold?: number | null;
  taxEnabled?: boolean;
  defaultTaxRate?: number;
  pricesIncludeTax?: boolean;
};
export type CountryPricingRule = {
  shippingEnabled?: boolean;
  shippingFee?: number | null;
  freeShippingThreshold?: number | null;
  taxEnabled?: boolean;
  taxRate?: number | null;
};
const money = (value: number) => Number(value.toFixed(2));

export function calculateAmounts(subtotal: number, country: string, settings?: PricingSettings | null, rule?: CountryPricingRule | null, taxableSubtotal = subtotal) {
  const shippingEnabled = settings?.shippingEnabled ?? false;
  const useShippingRule = shippingEnabled && Boolean(rule?.shippingEnabled);
  const shippingFee = useShippingRule ? Number(rule?.shippingFee ?? 0) : Number(settings?.defaultShippingFee ?? 0);
  const threshold = useShippingRule ? rule?.freeShippingThreshold : settings?.freeShippingThreshold;
  const shippingAmount = !shippingEnabled || (threshold != null && subtotal >= Number(threshold)) ? 0 : money(shippingFee);
  const taxEnabled = settings?.taxEnabled ?? false;
  const useTaxRule = taxEnabled && Boolean(rule?.taxEnabled);
  const rate = useTaxRule ? Number(rule?.taxRate ?? 0) : Number(settings?.defaultTaxRate ?? 0);
  const pricesIncludeTax = settings?.pricesIncludeTax ?? false;
  const taxAmount = !taxEnabled || rate === 0 ? 0 : money(pricesIncludeTax ? taxableSubtotal * rate / (100 + rate) : taxableSubtotal * rate / 100);
  return { subtotal: money(subtotal), shippingAmount, taxAmount, total: money(taxableSubtotal + shippingAmount + (pricesIncludeTax ? 0 : taxAmount)), pricesIncludeTax, country };
}
