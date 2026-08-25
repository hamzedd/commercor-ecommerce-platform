import { getTranslations } from "next-intl/server";
import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { LocaleType } from "@/src/i18n/config";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  product: ProductType;
  lang: LocaleType;
}

async function ProductPageSimilarProducts({ product, lang }: Props) {
  const t = await getTranslations();
  const products = (
    await fetchProducts({ filter: { categoryId: [product.categoryId] } })
  )?.data.filter((candidate) => candidate.id !== product.id);
  if (!products.length) return null;

  return (
    <section className="my-container mt-4 flex w-full flex-col gap-6 border-t border-slate-200 pt-10 sm:mt-6 sm:pt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-xs font-bold tracking-[0.16em] text-transparent uppercase">
            {t("youMayAlsoLike")}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {t("similarProducts")}
          </h2>
        </div>
        <p className="shrink-0 text-sm text-slate-600">
          {products.length}{" "}
          {products.length === 1 ? t("product") : t("products")}
        </p>
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto pb-5 sm:gap-4">
        {products.map((relatedProduct) => (
          <ProductCard
            className="h-auto w-[72vw] shrink-0 snap-start focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 focus-visible:outline-none sm:w-64 lg:w-72"
            key={relatedProduct.id}
            product={relatedProduct}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductPageSimilarProducts;
