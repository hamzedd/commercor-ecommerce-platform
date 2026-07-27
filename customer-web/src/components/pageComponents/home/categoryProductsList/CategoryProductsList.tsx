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
      (t) => t.lang.toString().toLowerCase() === lang.toLowerCase(),
    ) || category.translations[0];
  const products = await fetchProducts({
    filter: {
      categoryId: [category.id],
    },
  });

  return (
    <div className={"my-container flex flex-col gap-4 md:gap-5"}>
      <div className="flex items-center justify-between">
        <h1 className={"text-lg font-bold md:text-2xl"}>
          {categoryTranslation?.name} {t("productsList")}
        </h1>
        <Link
          className={"text-sm font-bold hover:underline md:text-lg"}
          href={{
            pathname: `/categories/[slug]`,
            params: { slug: categoryTranslation?.slug },
          }}
        >
          {t("viewAll")}
        </Link>
      </div>
      <CategoryProductsSlider products={products?.data} lang={lang} />
    </div>
  );
}

export default CategoryProductsList;
