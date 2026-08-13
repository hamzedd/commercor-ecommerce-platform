import { getTranslations } from "next-intl/server";

import ProductDescription from "@/src/components/pageComponents/product/ProductDescription";
import ProductPageHeader from "@/src/components/pageComponents/product/ProductPageHeader";
import ProductPageSimilarProducts from "@/src/components/pageComponents/product/ProductPageSimilarProducts";
import ProductImagesPreview from "@/src/components/pageComponents/product/productImagesPreview/ProductImagesPreview";
import ProductPurchaseBox from "@/src/components/pageComponents/product/productPurchaseBox/ProductPurchaseBox";
import { fetchProduct } from "@/src/service/apiServices/product.service";
import ProductReviews from "@/src/components/pageComponents/product/ProductReviews";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
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
    <main className="min-h-screen bg-stone-50 pb-16 text-stone-950">
      <ProductPageHeader
        productTranslation={productTranslation}
        product={product}
      />

      <div className="my-container grid items-start gap-6 py-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:py-10">
        <ProductImagesPreview
          images={product.images}
          productTranslation={productTranslation}
        />
        <ProductPurchaseBox product={product} />
        <div className="lg:col-span-2">
          <ProductDescription productTranslation={productTranslation} />
        </div>
        <div className="lg:col-span-2"><ProductReviews productId={product.id}/></div>
      </div>

      <ProductPageSimilarProducts product={product} lang={locale} />
    </main>
  );
}

export default Page;
