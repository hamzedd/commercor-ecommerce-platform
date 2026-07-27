import React from "react";
import {
  ProductTranslationType,
  ProductType,
} from "@/src/utils/types/product.type";
import ProductPageBreadcrumbs from "@/src/components/pageComponents/product/ProductPageBreadcrumbs";
import { getTranslations } from "next-intl/server";

interface Props {
  productTranslation: ProductTranslationType;
  product: ProductType;
}

async function ProductPageHeader({ productTranslation, product }: Props) {
  const t = await getTranslations();

  return (
    <div className={"my-container flex w-full flex-col gap-4"}>
      <ProductPageBreadcrumbs
        product={product}
        productTranslation={productTranslation}
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
        <h1
          className={"text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl"}
        >
          {productTranslation?.name}
        </h1>
        <p className="text-sm text-gray-500 md:text-base">
          <span className="font-medium">{t("productId")}:</span> {product.id}
        </p>
      </div>
    </div>
  );
}

export default ProductPageHeader;
