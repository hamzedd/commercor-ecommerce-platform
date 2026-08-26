import { getTranslations } from "next-intl/server";

import CategoriesList from "@/src/components/pageComponents/home/categoriesList/CategoriesList";
import CategoryProductsList from "@/src/components/pageComponents/home/categoryProductsList/CategoryProductsList";
import HomeHeroSearch from "@/src/components/pageComponents/home/HomeHeroSearch";
import HeroProductImage from "@/src/components/pageComponents/home/HeroProductImage";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { fetchCategories } from "@/src/service/apiServices/category.service";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { getStoreSettingsService } from "@/src/service/apiServices/storeSettings.service";
import formatCurrency from "@/src/utils/functions/formatCurrency";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  const categories = await fetchCategories();
  const productsResponse = await fetchProducts({});
  const settings = await getStoreSettingsService();
  const featuredProduct = productsResponse?.data?.[0];
  const featuredTranslation =
    featuredProduct?.translations?.find(
      (translation) => translation.lang.toLowerCase() === locale.toLowerCase(),
    ) || featuredProduct?.translations?.[0];
  const featuredImage = featuredProduct?.images?.[0]?.name
    ? getImageSrcByBucketAndFileNames({
        bucketName: "products",
        fileName: featuredProduct.images[0].name,
      })
    : null;
  const benefits = ["Fast", "Secure", "Quality", "Support"] as const;

  return (
    <main className="flex flex-col overflow-hidden bg-stone-50 text-stone-950">
      <section className="border-b border-stone-200 bg-white text-stone-950">
        <div className="my-container grid items-center gap-8 py-10 sm:gap-10 sm:py-14 md:min-h-[620px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-20">
          <div className="flex max-w-3xl flex-col items-start">
            <span className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase sm:mb-6 sm:text-xs sm:tracking-[0.18em]">
              {t("homeEyebrow")}
            </span>
            <h1 className="max-w-3xl text-[2.125rem] leading-[1.08] font-bold tracking-[-0.035em] min-[430px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              {t("homeHeroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-6 text-stone-600 sm:mt-6 sm:text-lg sm:leading-7">
              {t("homeHeroDescription")}
            </p>
            <div className="mt-6 w-full max-w-2xl sm:mt-8">
              <HomeHeroSearch />
              <p className="mt-3 hidden text-sm text-stone-500 sm:block">
                {t("homeSearchHint")}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
              <a
                href="#categories"
                className="rounded-md bg-[var(--store-accent)] px-4 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--store-accent)] focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5"
              >
                {t("browseCategories")}
              </a>
              {featuredTranslation?.slug && (
                <Link
                  href={{
                    pathname: "/products/[slug]",
                    params: { slug: featuredTranslation.slug },
                  }}
                  className="rounded-md border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-950 transition-colors duration-200 hover:border-stone-950 focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5"
                >
                  {t("shopFeatured")}
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[470px] overflow-hidden rounded-md border border-stone-200 bg-stone-50 p-4 sm:p-6">
              {featuredImage ? (
                <div className="overflow-hidden rounded-sm bg-stone-100">
                  <HeroProductImage
                    src={featuredImage}
                    alt={featuredTranslation?.name || t("featuredProduct")}
                    fallback={t("featuredProduct")}
                  />
                </div>
              ) : (
                <div className="flex min-h-[330px] items-center justify-center rounded-sm bg-stone-100">
                  <span className="text-stone-400">{t("featuredProduct")}</span>
                </div>
              )}
              {featuredProduct && (
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-[var(--store-accent)] uppercase">
                      {t("featured")}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-xl font-bold">
                      {featuredTranslation?.name}
                    </h2>
                    {featuredProduct.stock !== undefined && (
                      <p className="mt-2 text-sm text-stone-500">
                        {featuredProduct.stock > 0
                          ? t("itemsAvailable", {
                              count: featuredProduct.stock,
                            })
                          : t("outOfStock")}
                      </p>
                    )}
                  </div>
                  {featuredProduct.price && (
                    <div className="shrink-0 rounded-md bg-[var(--store-primary)] px-4 py-3 text-white">
                      <p className="text-xs font-medium text-stone-300">
                        {t("price")}
                      </p>
                      <p className="text-xl font-bold">
                        {formatCurrency(
                          featuredProduct.price,
                          settings.currencyCode,
                          locale,
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label={t("shoppingBenefits")}
        className="border-b border-stone-200 bg-white"
      >
        <div className="my-container grid grid-cols-2 gap-x-5 gap-y-7 py-8 lg:grid-cols-4 lg:py-10">
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className="flex gap-3 border-stone-200 last:border-0 lg:border-r lg:pr-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
                0{index + 1}
              </span>
              <div>
                <p className="font-semibold text-stone-950">
                  {t(`homeBenefit${benefit}Title`)}
                </p>
                <p className="mt-1 text-sm leading-5 text-stone-600">
                  {t(`homeBenefit${benefit}Text`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-20 bg-stone-50 py-16 sm:py-20 lg:gap-24">
        <section id="categories">
          <CategoriesList categories={categories} lang={locale as LocaleType} />
        </section>
        {categories?.map((category) => (
          <CategoryProductsList
            key={category.id}
            category={category}
            lang={locale as LocaleType}
          />
        ))}
      </div>
    </main>
  );
}
