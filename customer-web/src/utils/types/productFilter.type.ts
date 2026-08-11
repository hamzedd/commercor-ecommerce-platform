import type { ProductFilterOptionType } from "./productFilterOption.type.js";

export type ProductFilterTranslationType = {
  id: string;
  productFilterId: string;
  lang: string;
  name: string;
  slug: string;
};

export type ProductFilterType = {
  id: string;
  type: string;
  translations: Array<ProductFilterTranslationType>;
};

export type ProductFilterTypeType = {
  key: string;
  value: string;
};

export type ProductFilterWithOptionsType = ProductFilterType & {
  options: ProductFilterOptionType[];
};
