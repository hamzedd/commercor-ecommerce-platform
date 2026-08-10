import type { ProductFilterOptionType } from "./productFilterOptionTypes.ts";
import type { CategoryType } from "./categoryTypes.ts";

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
  categoryIds: string[];
  categories?: CategoryType[];
  translations: Array<ProductFilterTranslationType>;
};

export type ProductFilterTypeType = {
  key: string;
  value: string;
};

export type ProductFilterWithOptionsType = ProductFilterType & {
  options: ProductFilterOptionType[];
};
