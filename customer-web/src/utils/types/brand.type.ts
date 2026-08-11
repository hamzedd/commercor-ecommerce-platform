export type BrandTranslationType = {
  brandId: string | number;
  created_at: string;
  deleted_at: string;
  description: string;
  id: string;
  lang: string;
  metaDescription: string;
  metaTitle: string;
  name: string;
  slug: string;
  updated_at: string;
};

export type BrandImageType = {
  id: string;
  brandId: string;
};

export type BrandType = {
  createdAt?: string;
  deleted_at: string;
  id: string;
  imagepath: string;
  rank: number;
  translations?: Array<BrandTranslationType>;
  updated_at: string;
  images: BrandImageType[];
};
