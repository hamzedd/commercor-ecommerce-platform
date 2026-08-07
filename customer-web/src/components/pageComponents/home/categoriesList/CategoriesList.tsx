import { CategoryType } from "@/src/utils/types/category.type";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";

interface Props {
  categories: CategoryType[];
  lang: LocaleType;
}

function CategoriesList({ categories, lang }: Props) {
  const t = useTranslations();

  return (
    <div className="my-container flex flex-col gap-6">
      <div>
        <p className="text-2xl font-bold md:text-3xl">
          {t("categories")}
        </p>

        <p className="mt-1 text-sm text-gray-500 md:text-base">
          Browse products by category
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => {
          const translation =
            category.translations?.find(
              (item) =>
                item.lang.toLowerCase() === lang.toLowerCase(),
            ) || category.translations?.[0];

          const imageSrc = category.image
            ? getImageSrcByBucketAndFileNames({
                bucketName: "categories",
                fileName: category.image,
              })
            : null;

          return (
            <Link
              href={{
                pathname: "/categories/[slug]",
                params: {
                  slug: translation?.slug,
                },
              }}
              key={category.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={translation?.name || "Category"}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-lg font-bold text-white md:text-xl">
                  {translation?.name}
                </p>

                {translation?.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-200">
                    {translation.description}
                  </p>
                )}

                <span className="mt-3 inline-flex items-center text-sm font-semibold text-white">
                  Shop now
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesList;