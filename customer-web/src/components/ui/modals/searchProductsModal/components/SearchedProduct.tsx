"use client";

import React from "react";
import { ProductType } from "@/src/utils/types/product.type";
import Image from "next/image";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";

interface Props {
  product: ProductType;
  locale: string;
  setShow: (visible: boolean) => void;
}

function SearchedProduct({ product, locale, setShow }: Props) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const productLocale =
    product.translations?.find(
      (translation) => translation.lang.toLowerCase() === locale.toLowerCase(),
    ) || product.translations[0];

  return (
    <Link
      href={{
        pathname: "/products/[slug]",
        params: { slug: productLocale.slug },
      }}
      onClick={() => {
        setShow(false);
      }}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg hover:shadow-violet-950/10 sm:gap-4"
    >
      {/* Product Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-20 sm:w-20">
        {product.images?.[0]?.name ? (
          <Image
            fill
            src={getImageSrcByBucketAndFileNames({
              fileName: product.images[0].name,
              bucketName: "products",
            })}
            alt={productLocale?.name || t("productImage")}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-slate-400">{t("noImage")}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-violet-700 sm:line-clamp-1 sm:text-base md:text-lg">
          {productLocale?.name}
        </p>
        <p className="line-clamp-1 hidden text-sm text-slate-600 sm:line-clamp-2 sm:block">
          {productLocale?.description}
        </p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="text-base font-bold text-slate-900 sm:text-lg md:text-xl">
          {formatCurrency(product.price || 0, settings.currencyCode, locale)}
        </p>
        {product.stock !== undefined && (
          <p className="text-xs text-slate-500">
            {product.stock > 0 ? (
              <span className="text-emerald-600">{t("inStock")}</span>
            ) : (
              <span className="text-red-600">{t("outOfStock")}</span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}

export default SearchedProduct;
