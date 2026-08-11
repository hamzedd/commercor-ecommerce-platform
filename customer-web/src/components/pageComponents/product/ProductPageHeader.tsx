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
    <section className="border-b border-white/10 bg-stone-950 text-white">
      <div className="my-container py-6 sm:py-8 lg:py-10">
        <ProductPageBreadcrumbs
          product={product}
          productTranslation={productTranslation}
        />
        <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-bold tracking-[0.18em] text-amber-300 uppercase">
              {t("productOverview")}
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {productTranslation?.name}
            </h1>
          </div>
          <p className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-stone-300">
            <span className="font-semibold text-white">{t("productId")}</span>:{" "}
            {product.id}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductPageHeader;
