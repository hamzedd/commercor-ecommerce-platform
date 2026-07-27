import React from "react";
import { fetchCategoryBySlug } from "@/src/service/apiServices/category.service";
import { fetchProductFiltersByCategoryId } from "@/src/service/apiServices/productFilters.service";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import CategoryPage from "@/src/components/pageComponents/category/CategoryPage";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const { locale, slug } = await props.params;

  const category = await fetchCategoryBySlug(slug);

  const categoryTranslation =
    category.translations.find(
      (translation) => translation.lang.toLowerCase() === locale.toLowerCase(),
    ) || category.translations[0];

  return {
    title: categoryTranslation?.metaTitle,
    description: categoryTranslation?.metaDescription,
  };
}
async function Page(props: Props) {
  const { slug } = await props.params;

  const category = await fetchCategoryBySlug(slug);

  const productFilters = await fetchProductFiltersByCategoryId(category.id);

  const products = await fetchProducts({
    filter: { categoryId: category.id },
    limit: 20,
    page: 1,
  });

  return (
    <CategoryPage
      category={category}
      productFilters={productFilters}
      products={products}
    ></CategoryPage>
  );
}

export default Page;
