"use client";

import { CategoryType } from "@/src/utils/types/category.type";
import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";
import { useLocale, useTranslations } from "next-intl";
import CategoryPageFiltersListItem from "./CategoryPageFiltersListItem";

interface Props {
  category: CategoryType;
  productFilters: ProductFilterWithOptionsType[];
  productFilterValues: string[];
  setProductFilterValues: (values: string[]) => void;
}

export default function CategoryPageFiltersList({
  category,
  productFilters,
  productFilterValues,
  setProductFilterValues,
}: Props) {
  const locale = useLocale();
  const t = useTranslations();

  const handleClearAll = () => {
    setProductFilterValues([]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Desktop Header */}
      <div className="hidden border-b p-4 md:block">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("filters")}
          </h2>
          {productFilterValues.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              {t("clearAll")}
            </button>
          )}
        </div>
      </div>

      {/* Filter Items */}
      <div className="flex-1 space-y-1 p-4 md:space-y-0">
        {productFilters.map((filter, index) => (
          <CategoryPageFiltersListItem
            key={filter.id}
            productFilter={filter}
            locale={locale}
            productFilterValues={productFilterValues}
            setProductFilterValues={setProductFilterValues}
            isLast={index === productFilters.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
