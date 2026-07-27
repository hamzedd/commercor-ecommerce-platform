import React from "react";
import { ProductTranslationType } from "@/src/utils/types/product.type";
import { getTranslations } from "next-intl/server";

interface Props {
  productTranslation: ProductTranslationType;
}

async function ProductDescription({ productTranslation }: Props) {
  const t = await getTranslations();

  return (
    <div className="flex-1 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
        {t("productDescription")}
      </h2>
      <div
        className="prose prose-sm md:prose-base max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: productTranslation?.description }}
      />
    </div>
  );
}

export default ProductDescription;
