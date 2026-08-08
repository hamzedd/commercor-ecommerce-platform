"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { LocaleType } from "@/src/i18n/config";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  products: PaginatedResponseType<ProductType>;
  isLoading: boolean;
  locale: LocaleType;
}

function CategoryPageProductsList({ products, isLoading, locale }: Props) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <div
        aria-label={t("loadingProducts")}
        aria-busy="true"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="aspect-square animate-pulse bg-stone-200 motion-reduce:animate-none" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
              <div className="h-3 w-full animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
              <div className="h-6 w-2/5 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.data?.length) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <svg
              aria-hidden
              className="h-8 w-8"
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
          <h2 className="text-xl font-bold text-stone-950">
            {t("noProductsFound")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {t("tryAdjustingFilters")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.data.map((product) => (
        <ProductCard
          className="h-full focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4 focus-visible:outline-none"
          product={product}
          lang={locale}
          titleClassName="min-h-10 leading-5 md:min-h-0 md:leading-normal"
          key={product.id}
        />
      ))}
    </div>
  );
}

export default CategoryPageProductsList;
