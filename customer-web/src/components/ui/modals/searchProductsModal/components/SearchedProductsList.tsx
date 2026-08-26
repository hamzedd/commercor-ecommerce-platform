"use client";

import React from "react";
import { Form, FormInstance } from "antd";
import { useSearchProductsQuery } from "@/src/service/react-query/product/query/useSearchProductsQuery";
import SearchedProduct from "@/src/components/ui/modals/searchProductsModal/components/SearchedProduct";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  form: FormInstance;
  setShow: (visible: boolean) => void;
}

function SearchedProductsList({ form, setShow }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const search = Form.useWatch("search", form);

  const { data, isLoading } = useSearchProductsQuery({ search });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-200 p-3 motion-reduce:animate-none"
          >
            <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-slate-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded bg-slate-200"></div>
              <div className="h-4 w-full rounded bg-slate-100"></div>
              <div className="h-4 w-2/3 rounded bg-slate-100"></div>
            </div>
            <div className="h-6 w-16 rounded bg-slate-200"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state - no search term
  if (!search || search.trim() === "") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          {t("searchForProducts")}
        </h3>
        <p className="text-sm text-slate-600">{t("enterSearchTerm")}</p>
      </div>
    );
  }

  // Empty state - no results
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          {t("noResultsFound")}
        </h3>
        <p className="text-sm text-slate-600">{t("tryDifferentKeywords")}</p>
      </div>
    );
  }

  // Results
  return (
    <div className="animate-fade-scale-in flex w-full flex-col gap-2">
      <p className="mb-2 text-sm font-medium text-slate-600">
        {data.data.length} {data.data.length === 1 ? t("result") : t("results")}
      </p>
      <div className="max-h-[400px] space-y-2 overflow-y-auto">
        {data.data.map((product) => (
          <SearchedProduct
            setShow={setShow}
            key={product.id}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchedProductsList;
