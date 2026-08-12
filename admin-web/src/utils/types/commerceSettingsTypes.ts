export type CommerceCountryRule = {
  countryCode: string;
  shippingEnabled: boolean;
  shippingFee: number | null;
  freeShippingThreshold: number | null;
  taxEnabled: boolean;
  taxRate: number | null;
};

export type CommerceSettings = {
  shippingEnabled: boolean;
  defaultShippingFee: number;
  freeShippingThreshold: number | null;
  taxEnabled: boolean;
  defaultTaxRate: number;
  pricesIncludeTax: boolean;
  countryRules: CommerceCountryRule[];
};
