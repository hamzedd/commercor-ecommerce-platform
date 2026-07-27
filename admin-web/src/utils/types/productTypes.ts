import type { BrandType } from "./brandTypes.ts";
import type { CategoryType } from "./categoryTypes.ts";

export type ProductTranslationType = {
  name?: string;
  description?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  productId?: string;
  id: string;
  lang: string;
};

export type ProductImageType = {
  id: string;
  productId: string;
  name: string;
};

export type ProductType = {
  id: string | number;
  brandId: BrandType["id"];
  categoryId: CategoryType["id"];
  translations?: ProductTranslationType[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  price?: string;
  stock?: number;
  images: ProductImageType[];
};

export type CreateProductType = {
  parentId?: ProductType["id"];
  translations: Array<Omit<ProductTranslationType, "id" | "ProductId">>;
};
