"use client";
import { CategoryType } from "@/src/utils/types/category.type";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { ProductType } from "@/src/utils/types/product.type";
import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { useTranslations } from "next-intl";
import { LocaleType } from "@/src/i18n/config";

interface Props {
  category: CategoryType;
  products: PaginatedResponseType<ProductType>;
  isLoading: boolean;
  locale: LocaleType;
}

function CategoryPageProductsList({
  category,
  products,
  isLoading,
  locale,
}: Props) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <div
        className={
          "grid grow grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        }
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="mb-3 aspect-square w-full rounded-lg bg-gray-200"></div>
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-6 w-1/3 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.data || products.data.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {t("noProductsFound")}
          </h3>
          <p className="text-sm text-gray-600">{t("tryAdjustingFilters")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "grid grow grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      }
    >
      {products.data.map((product) => (
        <ProductCard product={product} lang={locale} key={product.id} />
      ))}
    </div>
  );
}

export default CategoryPageProductsList;
