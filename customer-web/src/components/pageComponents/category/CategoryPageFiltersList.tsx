"use client";

import { useLocale, useTranslations } from "next-intl";
import CategoryPageFiltersListItem from "./CategoryPageFiltersListItem";
import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";

interface Props {
  productFilters: ProductFilterWithOptionsType[];
  productFilterValues: string[];
  setProductFilterValues: (values: string[]) => void;
}

export default function CategoryPageFiltersList({
  productFilters,
  productFilterValues,
  setProductFilterValues,
}: Props) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="flex h-full flex-col">
      <div className="hidden border-b border-stone-200 px-5 py-4 md:block">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-stone-950">{t("filters")}</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {t("refineResults")}
            </p>
          </div>
          {productFilterValues.length > 0 && (
            <button
              type="button"
              onClick={() => setProductFilterValues([])}
              className="min-h-11 rounded-lg px-2 text-sm font-semibold text-amber-700 transition-colors hover:text-amber-900 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              {t("clearAll")}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 py-2">
        {productFilters.length > 0 ? (
          productFilters.map((filter, index) => (
            <CategoryPageFiltersListItem
              key={filter.id}
              productFilter={filter}
              locale={locale as import('@/src/i18n/config').LocaleType}
              productFilterValues={productFilterValues}
              setProductFilterValues={setProductFilterValues}
              isLast={index === productFilters.length - 1}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-stone-500">
            {t("noFiltersAvailable")}
          </p>
        )}
      </div>

      {productFilterValues.length > 0 && (
        <div className="border-t border-stone-200 p-4 md:hidden">
          <button
            type="button"
            onClick={() => setProductFilterValues([])}
            className="min-h-11 w-full rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            {t("clearAll")}
          </button>
        </div>
      )}
    </div>
  );
}
