"use client";

import { LocaleType } from "@/src/i18n/config";
import { ProductFilterWithOptionsType } from "@/src/utils/types/productFilter.type";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";

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

  const selectedCount = productFilter.options.filter((opt) =>
    productFilterValues?.includes(opt.id),
  ).length;

  return (
    <div className={`${!isLast ? "border-b" : ""} py-4`}>
      {/* Filter Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left transition-colors hover:text-black"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {filterTranslated?.name}
          </span>
          {selectedCount > 0 && (
            <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
              {selectedCount}
            </span>
          )}
        </div>
        <DownOutlined
          className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter Options */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "mt-3 max-h-96" : "max-h-0"
        }`}
      >
        <div className="space-y-2.5">
          {productFilter.options.map((option) => {
            const optionTranslated =
              option.translations.find(
                (translation) =>
                  translation?.lang.toLowerCase() === locale.toLowerCase(),
              ) || option.translations[0];

            return (
              <label
                key={option.id}
                className="group flex cursor-pointer items-center gap-3 transition-colors hover:text-black"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-black checked:bg-black hover:border-gray-400"
                    name={option.id}
                    checked={productFilterValues?.includes(option.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newValues = productFilterValues
                          ? [...productFilterValues, option.id]
                          : [option.id];
                        setProductFilterValues(newValues);
                      } else {
                        const newValues = productFilterValues?.filter(
                          (value) => value !== option.id,
                        );
                        setProductFilterValues?.(
                          newValues && newValues.length > 0 ? newValues : [],
                        );
                      }
                    }}
                  />
                  <svg
                    className="pointer-events-none absolute top-0.5 left-0.5 h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-black">
                  {optionTranslated?.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
