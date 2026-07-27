import React from "react";
import { ProductType } from "@/src/utils/types/product.type";
import Image from "next/image";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  product: ProductType;
  locale: string;
  setShow: (visible: boolean) => void;
}

function SearchedProduct({ product, locale, setShow }: Props) {
  const t = useTranslations();
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
      className="group flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {product.images?.[0]?.name ? (
          <Image
            fill
            src={getImageSrcByBucketAndFileNames({
              fileName: product.images[0].name,
              bucketName: "products",
            })}
            alt={productLocale?.name || t("productImage")}
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-gray-400">{t("noImage")}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-black md:text-lg">
          {productLocale?.name}
        </p>
        <p className="line-clamp-2 text-sm text-gray-600">
          {productLocale?.description}
        </p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-gray-900 md:text-xl">
          ${product.price}
        </p>
        {product.stock !== undefined && (
          <p className="text-xs text-gray-500">
            {product.stock > 0 ? (
              <span className="text-green-600">{t("inStock")}</span>
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
