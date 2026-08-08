"use client";

import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { LocaleType } from "@/src/i18n/config";
import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";

interface Props {
  productFilter: ProductFilterWithOptionsType;
  locale: LocaleType;
  productFilterValues: string[];
  setProductFilterValues: (values: string[]) => void;
  isLast?: boolean;
}

export default function CategoryPageFiltersListItem({
  productFilter,
  locale,
  productFilterValues,
  setProductFilterValues,
  isLast = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const filterTranslated =
    productFilter.translations.find(
      (translation) => translation?.lang.toLowerCase() === locale.toLowerCase(),
    ) || productFilter.translations[0];
  const selectedCount = productFilter.options.filter((option) =>
    productFilterValues.includes(option.id),
  ).length;
  const optionsId = `filter-options-${productFilter.id}`;

  return (
    <div className={`${!isLast ? "border-b border-stone-200" : ""} py-3`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={optionsId}
        className="flex min-h-11 w-full items-center justify-between rounded-lg text-left transition-colors hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
      >
        <span className="flex items-center gap-2">
          <span className="font-semibold text-stone-900">
            {filterTranslated?.name}
          </span>
          {selectedCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
              {selectedCount}
            </span>
          )}
        </span>
        <DownOutlined
          aria-hidden
          className={`mr-1 text-xs transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={optionsId}
        className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 pt-1 pb-2">
            {productFilter.options.map((option) => {
              const optionTranslated =
                option.translations.find(
                  (translation) =>
                    translation?.lang.toLowerCase() === locale.toLowerCase(),
                ) || option.translations[0];
              const checked = productFilterValues.includes(option.id);

              return (
                <label
                  key={option.id}
                  className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 transition-colors hover:bg-stone-100"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer rounded border-2 border-stone-300 accent-stone-950 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    name={option.id}
                    checked={checked}
                    onChange={(event) =>
                      setProductFilterValues(
                        event.target.checked
                          ? [...productFilterValues, option.id]
                          : productFilterValues.filter(
                              (value) => value !== option.id,
                            ),
                      )
                    }
                  />
                  <span className="text-sm text-stone-700 group-hover:text-stone-950">
                    {optionTranslated?.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
