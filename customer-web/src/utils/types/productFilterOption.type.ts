export type ProductFilterOptionTranslationType = {
  id: string;
  productFilterOptionId: string;
  lang: string;
  name: string;
};

export type ProductFilterOptionType = {
  id: string;
  productFilterId: string;
  translations: Array<ProductFilterOptionTranslationType>;
};
