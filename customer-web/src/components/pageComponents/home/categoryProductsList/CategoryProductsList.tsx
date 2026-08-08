import { getTranslations } from "next-intl/server";
import CategoryProductsSlider from "@/src/components/pageComponents/home/categoryProductsList/components/CategoryProductsSlider";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import { CategoryType } from "@/src/utils/types/category.type";

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
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.18em] text-amber-700 uppercase">
            {t("featuredCollection")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 md:text-4xl">
            {categoryTranslation?.name}
          </h2>
        </div>
        <Link
          className="group flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-stone-700 transition-colors hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none md:text-base"
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
      </div>
      <CategoryProductsSlider products={products.data} lang={lang} />
    </section>
  );
}

export default CategoryProductsList;
