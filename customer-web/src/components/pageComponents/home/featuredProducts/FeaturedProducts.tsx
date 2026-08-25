import { getTranslations } from "next-intl/server";
import FeaturedProductsGrid from "@/src/components/pageComponents/home/featuredProducts/FeaturedProductsGrid";
import { LocaleType } from "@/src/i18n/config";
import { fetchProducts } from "@/src/service/apiServices/product.service";

interface Props {
  lang: LocaleType;
}

async function FeaturedProducts({ lang }: Props) {
  const t = await getTranslations();
  const products = await fetchProducts({ limit: 10 });

  if (!products?.data?.length) return null;

  return (
    <section id="featured" className="my-container scroll-mt-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4 sm:p-8 lg:p-10">
        <div
          aria-hidden
          className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl"
        />
        <div className="relative flex flex-col gap-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-sm font-bold tracking-[0.18em] text-transparent uppercase">
                {t("handpicked")}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                {t("featuredProducts")}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {t("featuredProductsDescription")}
              </p>
            </div>
          </div>

          <FeaturedProductsGrid products={products.data} lang={lang} />
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
