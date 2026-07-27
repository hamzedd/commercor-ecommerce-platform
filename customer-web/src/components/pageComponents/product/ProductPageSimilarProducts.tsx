import React from "react";
import { ProductType } from "@/src/utils/types/product.type";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { LocaleType } from "@/src/i18n/config";
import { getTranslations } from "next-intl/server";

interface Props {
  product: ProductType;
  lang: LocaleType;
}

async function ProductPageSimilarProducts({ product, lang }: Props) {
  const t = await getTranslations();
  const products = (
    await fetchProducts({
      filter: {
        categoryId: [product.categoryId],
      },
    })
  )?.data.filter((p) => p.id !== product.id);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={"my-container flex w-full flex-col gap-4 md:gap-6"}>
      <div className="flex items-center justify-between">
        <h2 className={"text-xl font-bold text-gray-900 md:text-2xl"}>
          {t("similarProducts")}
        </h2>
        <p className="text-sm text-gray-600">
          {products.length}{" "}
          {products.length === 1 ? t("product") : t("products")}
        </p>
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4 md:gap-4">
        {products.map((product) => (
          <ProductCard
            className={"max-w-[300px]"}
            key={product.id}
            product={product}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductPageSimilarProducts;
