import { useTranslations } from "next-intl";
import Image from "next/image";
import { CategoryType } from "@/src/utils/types/category.type";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { selectTranslation } from "@/src/utils/i18n/selectTranslation";
import Reveal from "@/src/components/ui/utis/reveal/Reveal";

interface Props {
  categories: CategoryType[];
  lang: LocaleType;
}

const CATEGORY_ACCENTS = [
  { overlay: "from-blue-950/90 via-blue-900/20", chip: "text-blue-300" },
  { overlay: "from-violet-950/90 via-violet-900/20", chip: "text-violet-300" },
  { overlay: "from-pink-950/90 via-pink-900/20", chip: "text-pink-300" },
  { overlay: "from-teal-950/90 via-teal-900/20", chip: "text-teal-300" },
  { overlay: "from-indigo-950/90 via-indigo-900/20", chip: "text-indigo-300" },
] as const;

function CategoriesList({ categories, lang }: Props) {
  const t = useTranslations();

  return (
    <div className="my-container flex flex-col gap-8">
      <Reveal className="max-w-2xl">
        <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-sm font-bold tracking-[0.18em] text-transparent uppercase">
          {t("shopByCategory")}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {t("categories")}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {t("homeCategoriesDescription")}
        </p>
      </Reveal>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          {t("homeNoCategories")}
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {categories.map((category, index) => {
            const translation = selectTranslation(category.translations, lang)!;
            const imageSrc = category.image
              ? getImageSrcByBucketAndFileNames({
                  bucketName: "categories",
                  fileName: category.image,
                })
              : null;
            const accent = CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length];

            return (
              <Reveal key={category.id} delay={(index % 5) * 70}>
                <Link
                  href={{
                    pathname: "/categories/[slug]",
                    params: { slug: translation?.slug },
                  }}
                  className="group relative flex aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-950/20 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 focus-visible:outline-none active:scale-[0.99] sm:aspect-[4/3] lg:aspect-[4/5]"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={translation?.name || t("categories")}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-400" />
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${accent.overlay} to-transparent transition-opacity duration-300 group-hover:opacity-90`}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="text-lg font-bold text-white md:text-xl">
                      {translation?.name}
                    </h3>
                    {translation?.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-200">
                        {translation.description}
                      </p>
                    )}
                    <span
                      className={`mt-3 inline-flex items-center text-sm font-semibold ${accent.chip}`}
                    >
                      {t("shopNow")}
                      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1.5">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoriesList;
