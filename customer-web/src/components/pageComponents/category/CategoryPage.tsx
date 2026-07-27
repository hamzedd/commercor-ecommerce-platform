"use client";
import CategoryPageFiltersList from "@/src/components/pageComponents/category/CategoryPageFiltersList";
import CategoryPageProductsList from "@/src/components/pageComponents/category/CategoryPageProductsList";
import { ProductType } from "@/src/utils/types/product.type";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { CategoryType } from "@/src/utils/types/category.type";
import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";
import { useProductsQuery } from "@/src/service/react-query/product/query/useProductsQuery";
import { useState } from "react";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  products: PaginatedResponseType<ProductType>;
  category: CategoryType;
  productFilters: ProductFilterWithOptionsType[];
}
function CategoryPage({ products, category, productFilters }: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const [productFilterValues, setProductFilterValues] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { data, isFetched, isFetching } = useProductsQuery({
    page: 1,
    categoryId: category.id,
    initialData: products,
    productFilterValues,
  });

  const categoryTranslated =
    category.translations.find(
      (translation) => translation?.lang.toLowerCase() === locale.toLowerCase(),
    ) || category.translations[0];

  const activeFiltersCount = productFilterValues.length;

  return (
    <div className="flex w-full flex-col items-center bg-gray-50 py-4 md:py-6">
      <div className="my-container flex flex-col gap-4 md:gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {categoryTranslated?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              {data ? data?.meta.totalItems : products?.meta.totalItems}{" "}
              {t("productsFound")}
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:shadow-md md:hidden"
          >
            <FilterOutlined className="text-base" />
            <span>{t("filters")}</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Mobile Filter Drawer Overlay */}
          {showFilters && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-white shadow-xl transition-transform duration-300 md:relative md:inset-auto md:z-auto md:w-[260px] md:translate-x-0 md:rounded-xl md:shadow-sm`}
          >
            {/* Mobile Filter Header */}
            <div className="flex items-center justify-between border-b p-4 md:hidden">
              <h2 className="text-lg font-semibold">{t("filters")}</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <CloseOutlined />
              </button>
            </div>

            <CategoryPageFiltersList
              category={category}
              productFilters={productFilters}
              productFilterValues={productFilterValues}
              setProductFilterValues={setProductFilterValues}
            />

            {/* Mobile Apply Button */}
            <div className="border-t p-4 md:hidden">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                {t("show")} {data?.meta.totalItems || products?.meta.totalItems}{" "}
                {t("products")}
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className="flex-1">
            <CategoryPageProductsList
              category={category}
              products={(isFetched ? data || [] : products) as never}
              isLoading={isFetching}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
