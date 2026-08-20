import React from "react";
import {
  ProductTranslationType,
  ProductType,
} from "@/src/utils/types/product.type";
import { LocaleType } from "@/src/i18n/config";
import Image from "next/image";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import WishlistButton from "@/src/components/ui/WishlistButton";
import { selectTranslation } from "@/src/utils/i18n/selectTranslation";

interface Props {
  product: ProductType;
  lang: LocaleType;
  className?: string;
  titleClassName?: string;
}

function ProductCard({ product, lang, className, titleClassName }: Props) {
  const t = useTranslations();
  const settings = useStoreSettings();

  const productTranslation: ProductTranslationType = selectTranslation(
    product?.translations,
    lang,
  )!;

  return (
    <Link
      href={{
        pathname: `/products/[slug]`,
        params: { slug: productTranslation.slug },
      }}
      key={product.id}
      className={`store-card-enter group relative flex w-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-xl ${className}`}
    >
      <WishlistButton
        productId={product.id}
        className="absolute end-3 top-3 z-20"
      />
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f5f6] sm:aspect-square">
        {product?.images?.[0] && (
          <Image
            src={getImageSrcByBucketAndFileNames({
              bucketName: "products",
              fileName: product.images[0]?.name,
            })}
            alt={productTranslation?.name || t("productImage")}
            width={300}
            height={300}
            className={
              "h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.045] motion-reduce:transition-none"
            }
          />
        )}

        {/* Quick View Overlay - appears on hover */}
        <div className="absolute inset-x-3 bottom-3 flex justify-center opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="translate-y-2 rounded-xl bg-white/95 px-4 py-2 text-xs font-semibold text-stone-900 shadow-lg backdrop-blur transition-transform duration-200 group-hover:translate-y-0">
            {t("viewDetails")}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        <h2
          className={`mb-1 line-clamp-2 text-sm font-semibold text-gray-900 md:text-base ${titleClassName || ""}`}
        >
          {productTranslation?.name}
        </h2>
        <p
          className={
            "mb-2 line-clamp-2 flex-1 text-xs text-gray-600 md:text-sm"
          }
        >
          {productTranslation?.description}
        </p>
        {(product.reviewCount || 0) > 0 && (
          <p className="mb-2 text-sm font-semibold text-amber-700">
            ★ {product.averageRating?.toFixed(1)}{" "}
            <span className="font-normal text-stone-500">
              ({product.reviewCount})
            </span>
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <p className={"text-lg font-bold text-gray-900 md:text-xl"}>
            {formatCurrency(product.price || 0, settings.currencyCode, lang)}
          </p>
          <div
            data-directional-icon="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--store-primary)] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:h-9 md:w-9"
          >
            <svg
              className="h-4 w-4 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
