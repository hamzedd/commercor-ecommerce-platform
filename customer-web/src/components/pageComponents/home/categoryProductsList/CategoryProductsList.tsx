import { getTranslations } from "next-intl/server";
import CategoryProductsSlider from "@/src/components/pageComponents/home/categoryProductsList/components/CategoryProductsSlider";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import { CategoryType } from "@/src/utils/types/category.type";
import Reveal from "@/src/components/ui/utis/reveal/Reveal";

interface Props {
  category: CategoryType;
  lang: LocaleType;
}

async function CategoryProductsList({ category, lang }: Props) {
  const t = await getTranslations();
  const categoryTranslation =
    category.translations.find(
      (item) => item.lang.toLowerCase() === lang.toLowerCase(),
    ) || category.translations[0];
  const products = await fetchProducts({
    filter: { categoryId: [category.id] },
  });
  if (!products?.data?.length) return null;

  return (
    <section className="my-container flex flex-col gap-7">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-sm font-bold tracking-[0.18em] text-transparent uppercase">
            {t("featuredCollection")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {categoryTranslation?.name}
          </h2>
        </div>
        <Link
          className="group flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none md:text-base"
          href={{
            pathname: "/categories/[slug]",
            params: { slug: categoryTranslation?.slug },
          }}
        >
          {t("viewAll")}
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </Reveal>
      <Reveal delay={80}>
        <CategoryProductsSlider products={products.data} lang={lang} />
      </Reveal>
    </section>
  );
}

export default CategoryProductsList;
