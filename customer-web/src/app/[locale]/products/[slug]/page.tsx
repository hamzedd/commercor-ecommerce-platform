import React from "react";
import { fetchProduct } from "@/src/service/apiServices/product.service";
import ProductImagesPreview from "@/src/components/pageComponents/product/productImagesPreview/ProductImagesPreview";
import ProductPageHeader from "@/src/components/pageComponents/product/ProductPageHeader";
import ProductPurchaseBox from "@/src/components/pageComponents/product/productPurchaseBox/ProductPurchaseBox";
import ProductDescription from "@/src/components/pageComponents/product/ProductDescription";
import ProductPageSimilarProducts from "@/src/components/pageComponents/product/ProductPageSimilarProducts";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const t = await getTranslations();
  const { locale, slug } = await props.params;

  const product = await fetchProduct(slug);

  const productTranslation =
    product.translations.find(
      (translation) => translation.lang.toLowerCase() === locale.toLowerCase(),
    ) || product.translations[0];

  return {
    title: productTranslation?.metaTitle || t("product"),
    description:
      productTranslation?.metaDescription || t("productMetaDescription"),
  };
}

async function Page(props: Props) {
  const { locale, slug } = await props.params;

  const product = await fetchProduct(slug);

  const productTranslation =
    product.translations.find(
      (translation) => translation.lang.toLowerCase() === locale.toLowerCase(),
    ) || product.translations[0];

  return (
    <div
      className={
        "flex flex-col items-center gap-6 bg-gray-50 py-4 md:gap-8 md:py-8"
      }
    >
      <ProductPageHeader
        productTranslation={productTranslation}
        product={product}
      />
      <div className="my-container flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <ProductImagesPreview
            images={product.images}
            productTranslation={productTranslation}
          />
          <ProductDescription productTranslation={productTranslation} />
        </div>
        <ProductPurchaseBox product={product} />
      </div>
      <ProductPageSimilarProducts product={product} lang={locale} />
    </div>
  );
}

export default Page;
