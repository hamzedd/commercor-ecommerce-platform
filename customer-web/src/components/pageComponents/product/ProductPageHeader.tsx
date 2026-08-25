import { getTranslations } from "next-intl/server";
import ProductPageBreadcrumbs from "@/src/components/pageComponents/product/ProductPageBreadcrumbs";
import {
  ProductTranslationType,
  ProductType,
} from "@/src/utils/types/product.type";

interface Props {
  productTranslation: ProductTranslationType;
  product: ProductType;
}

async function ProductPageHeader({ productTranslation, product }: Props) {
  const t = await getTranslations();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-950 text-white">
      <div
        aria-hidden
        className="animate-blob-pulse animate-float-slow absolute -top-20 -right-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.04]"
      />
      <div className="my-container relative py-6 sm:py-8 lg:py-10">
        <ProductPageBreadcrumbs
          product={product}
          productTranslation={productTranslation}
        />
        <div className="mt-5 sm:mt-6">
          <div className="max-w-4xl">
            <p className="text-xs font-bold tracking-[0.18em] text-violet-300 uppercase">
              {t("productOverview")}
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {productTranslation?.name}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPageHeader;
