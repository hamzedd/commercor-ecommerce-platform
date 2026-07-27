import { CategoryType } from "@/src/utils/types/category.type";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  categories: CategoryType[];
  lang: LocaleType;
}

function CategoriesList({ categories, lang }: Props) {
  const t = useTranslations();

  return (
    <div className="my-container flex flex-col gap-4 md:gap-5">
      <p className={"text-lg font-bold md:text-xl"}>{t("categories")}</p>
      <div
        className={
          "grid w-full grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 md:gap-4 lg:grid-cols-10"
        }
      >
        {categories.map((category) => {
          let translation = category?.translations?.find(
            (t) => t.lang.toLowerCase() === lang.toLowerCase(),
          );
          if (!translation) {
            translation = category?.translations?.[0];
          }

          return (
            <Link
              href={{
                pathname: `/categories/[slug]`,
                params: { slug: translation?.slug },
              }}
              type={"button"}
              key={category.id}
              className={
                "flex aspect-[1/1] flex-col items-center justify-center rounded-lg bg-gray-300 p-2 transition-colors hover:bg-gray-400 md:p-4"
              }
            >
              <span
                className={"w-full truncate text-center text-xs sm:text-sm"}
              >
                {translation?.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesList;
