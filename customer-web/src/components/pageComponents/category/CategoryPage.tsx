"use client";

import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import CategoryPageFiltersList from "@/src/components/pageComponents/category/CategoryPageFiltersList";
import CategoryPageProductsList from "@/src/components/pageComponents/category/CategoryPageProductsList";
import { useProductsQuery } from "@/src/service/react-query/product/query/useProductsQuery";
import { PaginatedResponseType } from "@/src/utils/types/api.type";
import { CategoryType } from "@/src/utils/types/category.type";
import { ProductType } from "@/src/utils/types/product.type";
import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";
import { selectTranslation } from "@/src/utils/i18n/selectTranslation";

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
  const [sortBy, setSortBy] = useState("id:DESC");
  const [page, setPage] = useState(1);

  const { data, isFetching } = useProductsQuery({
    page,
    categoryId: category.id,
    initialData: products,
    productFilterValues,
    sortBy,
  });

  useEffect(() => {
    if (!showFilters) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowFilters(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showFilters]);

  const categoryTranslated = selectTranslation(category.translations, locale)!;
  const currentProducts = data || products;
  const activeFiltersCount = productFilterValues.length;

  const updateFilters = (values: string[]) => {
    setProductFilterValues(values);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-950 text-white">
        <div
          aria-hidden
          className="animate-blob-pulse animate-float-slow absolute -top-20 -right-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.04]"
        />
        <div className="my-container relative py-8 sm:py-10 lg:py-12">
          <p className="text-xs font-bold tracking-[0.18em] text-violet-300 uppercase">
            {t("categoryCollection")}
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {categoryTranslated?.name}
          </h1>
          {categoryTranslated?.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {categoryTranslated.description}
            </p>
          )}
        </div>
      </section>

      <div className="my-container py-6 sm:py-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-slate-600">
              <span className="font-bold text-slate-950">
                {currentProducts.meta.totalItems}
              </span>{" "}
              {t("productsFound")}
            </p>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-gradient-to-r from-blue-100 via-violet-100 to-pink-100 px-2.5 py-1 text-xs font-bold text-violet-900 sm:hidden">
                {t("activeFilters", { count: activeFiltersCount })}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              aria-haspopup="dialog"
              className="relative flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:border-violet-500 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
            >
              <FilterOutlined aria-hidden />
              {t("filters")}
              {activeFiltersCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 px-1 text-xs text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-600 focus-within:ring-2 focus-within:ring-violet-500 focus-within:ring-offset-2">
              <span className="hidden sm:inline">{t("sortBy")}</span>
              <select
                value={sortBy}
                aria-label={t("sortBy")}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
                className="min-w-0 flex-1 cursor-pointer bg-transparent font-semibold text-slate-900 outline-none"
              >
                <option value="id:DESC">{t("sortNewest")}</option>
                <option value="price:ASC">{t("sortPriceLow")}</option>
                <option value="price:DESC">{t("sortPriceHigh")}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-start gap-6 lg:gap-8">
          <aside className="sticky top-28 hidden w-64 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block lg:w-72">
            <CategoryPageFiltersList
              productFilters={productFilters}
              productFilterValues={productFilterValues}
              setProductFilterValues={updateFilters}
            />
          </aside>

          <div className="min-w-0 flex-1">
            <CategoryPageProductsList
              products={currentProducts}
              isLoading={isFetching}
              locale={locale as import("@/src/i18n/config").LocaleType}
            />

            {currentProducts.meta.totalPages > 1 && (
              <nav
                aria-label={t("pagination")}
                className="mt-8 flex items-center justify-center gap-3"
              >
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold transition-colors hover:border-violet-500 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("previous")}
                </button>
                <span className="text-sm font-medium text-slate-600">
                  {t("pageOf", {
                    page: currentProducts.meta.currentPage,
                    total: currentProducts.meta.totalPages,
                  })}
                </span>
                <button
                  type="button"
                  disabled={
                    page >= currentProducts.meta.totalPages || isFetching
                  }
                  onClick={() => setPage((current) => current + 1)}
                  className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold transition-colors hover:border-violet-500 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("next")}
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-title"
        >
          <button
            type="button"
            aria-label={t("closeFilters")}
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 h-full w-full bg-[#0b0821]/70 backdrop-blur-[2px]"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2
                  id="mobile-filter-title"
                  className="text-lg font-bold text-slate-950"
                >
                  {t("filters")}
                </h2>
                <p className="text-xs text-slate-500">{t("refineResults")}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label={t("closeFilters")}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
              >
                <CloseOutlined aria-hidden />
              </button>
            </div>
            <div className="max-h-[calc(85vh-132px)] overflow-y-auto">
              <CategoryPageFiltersList
                productFilters={productFilters}
                productFilterValues={productFilterValues}
                setProductFilterValues={updateFilters}
              />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="min-h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-4 text-sm font-bold text-white shadow-md shadow-violet-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t("showProducts", { count: currentProducts.meta.totalItems })}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CategoryPage;
