import { useTranslations } from "next-intl";
import Image from "next/image";
import { CategoryType } from "@/src/utils/types/category.type";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";

interface Props {
  categories: CategoryType[];
  lang: LocaleType;
}

function CategoriesList({ categories, lang }: Props) {
  const t = useTranslations();

  return (
    <div className="my-container flex flex-col gap-8">
      <div className="max-w-2xl">
        <p className="text-sm font-bold tracking-[0.18em] text-amber-700 uppercase">
          {t("shopByCategory")}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 md:text-4xl">
          {t("categories")}
        </h2>
        <p className="mt-3 text-base leading-7 text-stone-600">
          {t("homeCategoriesDescription")}
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-stone-600">
          {t("homeNoCategories")}
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {categories.map((category) => {
            const translation =
              category.translations?.find(
                (item) => item.lang.toLowerCase() === lang.toLowerCase(),
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
                  params: { slug: translation?.slug },
                }}
                key={category.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 shadow-sm ring-1 ring-black/5 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4 focus-visible:outline-none sm:aspect-[4/3] lg:aspect-[4/5]"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={translation?.name || t("categories")}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-400" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="text-lg font-bold text-white md:text-xl">
                    {translation?.name}
                  </h3>
                  {translation?.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-200">
                      {translation.description}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center text-sm font-semibold text-amber-300">
                    {t("shopNow")}
                    <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoriesList;
