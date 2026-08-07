import { CategoryType } from "@/src/utils/types/category.type";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { getTranslations } from "next-intl/server";
import CategoryProductsSlider from "@/src/components/pageComponents/home/categoryProductsList/components/CategoryProductsSlider";

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
    filter: {
      categoryId: [category.id],
    },
  });

  if (!products?.data?.length) {
    return null;
  }

  return (
    <section className="my-container flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Featured collection
          </p>

          <h2 className="mt-1 text-2xl font-bold md:text-3xl">
            {categoryTranslation?.name}
          </h2>
        </div>

        <Link
          className="group flex items-center gap-2 text-sm font-semibold transition hover:text-gray-600 md:text-base"
          href={{
            pathname: "/categories/[slug]",
            params: {
              slug: categoryTranslation?.slug,
            },
          }}
        >
          {t("viewAll")}
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      <CategoryProductsSlider products={products.data} lang={lang} />
    </section>
  );
}

export default CategoryProductsList;