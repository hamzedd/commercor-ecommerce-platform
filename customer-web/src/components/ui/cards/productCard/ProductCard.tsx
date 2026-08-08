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

interface Props {
  product: ProductType;
  lang: LocaleType;
  className?: string;
  titleClassName?: string;
}

function ProductCard({ product, lang, className, titleClassName }: Props) {
  const t = useTranslations();

  const productTranslation: ProductTranslationType =
    product?.translations?.find(
      (t) => t.lang.toString().toLowerCase() === lang.toLowerCase(),
    ) || product?.translations?.[0];

  return (
    <Link
      href={{
        pathname: `/products/[slug]`,
        params: { slug: productTranslation.slug },
      }}
      key={product.id}
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
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
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            }
          />
        )}

        {/* Quick View Overlay - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
          <span className="translate-y-4 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg transition-transform duration-300 group-hover:translate-y-0">
            {t("viewDetails")}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
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

        {/* Price */}
        <div className="flex items-center justify-between border-t pt-3">
          <p className={"text-lg font-bold text-gray-900 md:text-xl"}>
            ${product.price}
          </p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white opacity-0 transition-opacity group-hover:opacity-100 md:h-9 md:w-9">
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
