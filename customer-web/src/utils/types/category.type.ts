export type CategoryTranslationType = {
  id: string;
  categoryId: string;
  lang: string;
  name: string;
  description: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
};

export type CategoryType = {
  id: string;
  created_at: string;
  parentId?: CategoryType["id"];
  translations: Array<CategoryTranslationType>;
};
