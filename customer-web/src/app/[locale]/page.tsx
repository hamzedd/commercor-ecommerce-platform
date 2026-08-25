import { getTranslations } from "next-intl/server";
import {
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  ThunderboltOutlined,
  LockOutlined,
  UndoOutlined,
  CarOutlined,
} from "@ant-design/icons";

import CategoriesList from "@/src/components/pageComponents/home/categoriesList/CategoriesList";
import CategoryProductsList from "@/src/components/pageComponents/home/categoryProductsList/CategoryProductsList";
import FeaturedProducts from "@/src/components/pageComponents/home/featuredProducts/FeaturedProducts";
import HomeCallToAction from "@/src/components/pageComponents/home/homeCta/HomeCallToAction";
import HomeHeroSearch from "@/src/components/pageComponents/home/HomeHeroSearch";
import HeroProductImage from "@/src/components/pageComponents/home/HeroProductImage";
import Reveal from "@/src/components/ui/utis/reveal/Reveal";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import { fetchCategories } from "@/src/service/apiServices/category.service";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { getStoreSettingsService } from "@/src/service/apiServices/storeSettings.service";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import { selectTranslation } from "@/src/utils/i18n/selectTranslation";

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
  const featuredTranslation = selectTranslation(
    featuredProduct?.translations,
    locale,
  );
  const featuredImage = featuredProduct?.images?.[0]?.name
    ? getImageSrcByBucketAndFileNames({
        bucketName: "products",
        fileName: featuredProduct.images[0].name,
      })
    : null;

  const benefits = [
    {
      key: "Fast",
      Icon: ThunderboltOutlined,
      from: "from-blue-500",
      to: "to-sky-400",
      ring: "group-hover:shadow-blue-500/25",
    },
    {
      key: "Secure",
      Icon: SafetyCertificateOutlined,
      from: "from-violet-500",
      to: "to-purple-400",
      ring: "group-hover:shadow-violet-500/25",
    },
    {
      key: "Quality",
      Icon: StarOutlined,
      from: "from-pink-500",
      to: "to-rose-400",
      ring: "group-hover:shadow-pink-500/25",
    },
    {
      key: "Support",
      Icon: CustomerServiceOutlined,
      from: "from-teal-500",
      to: "to-emerald-400",
      ring: "group-hover:shadow-teal-500/25",
    },
  ] as const;

  return (
    <main className="flex flex-col overflow-hidden bg-slate-50 text-slate-950">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#0b0821]">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#0b0821] via-[#1e1147] to-[#0b1740]"
        />
        <div
          aria-hidden
          className="animate-blob-pulse animate-float-slow absolute -top-24 -left-16 h-[26rem] w-[26rem] rounded-full bg-violet-600/40 blur-[110px]"
        />
        <div
          aria-hidden
          className="animate-blob-pulse animate-float-slower absolute top-1/3 -right-24 h-[24rem] w-[24rem] rounded-full bg-blue-500/35 blur-[110px] [animation-delay:1.2s]"
        />
        <div
          aria-hidden
          className="animate-blob-pulse absolute -bottom-32 left-1/4 h-[22rem] w-[22rem] rounded-full bg-pink-500/30 blur-[110px] [animation-delay:2.4s]"
        />
        <div
          aria-hidden
          className="absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px] opacity-[0.05]"
        />

        <div className="my-container relative grid items-center gap-8 py-14 sm:gap-10 sm:py-16 md:min-h-[660px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-24">
          <div className="store-card-enter flex max-w-3xl flex-col items-start text-white">
            <span className="animate-badge-glow glass-panel mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-violet-200 uppercase sm:mb-6 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400" />
              {t("homeEyebrow")}
            </span>
            <h1 className="max-w-3xl text-[2.125rem] leading-[1.08] font-bold tracking-[-0.035em] min-[430px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              {t("homeHeroTitle")
                .split(" ")
                .map((word, index, arr) => (
                  <span
                    key={index}
                    className={
                      index >= arr.length - 2
                        ? "text-gradient-brand animate-gradient-pan"
                        : undefined
                    }
                  >
                    {word}
                    {index < arr.length - 1 ? " " : ""}
                  </span>
                ))}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-6 text-slate-300 sm:mt-6 sm:text-lg sm:leading-7">
              {t("homeHeroDescription")}
            </p>
            <div className="mt-6 w-full max-w-2xl sm:mt-8">
              <HomeHeroSearch />
              <p className="mt-3 hidden text-sm text-slate-400 sm:block">
                {t("homeSearchHint")}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
              <a
                href="#categories"
                className="group relative inline-flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-[length:200%_auto] bg-[position:0%_50%] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition-all duration-200 hover:scale-[1.02] hover:bg-[position:100%_50%] hover:shadow-xl hover:shadow-violet-800/50 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0821] focus-visible:outline-none sm:px-5"
              >
                {t("browseCategories")}
              </a>
              {featuredTranslation?.slug && (
                <Link
                  href={{
                    pathname: "/products/[slug]",
                    params: { slug: featuredTranslation.slug },
                  }}
                  className="glass-panel rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0821] focus-visible:outline-none sm:px-5"
                >
                  {t("shopFeatured")}
                </Link>
              )}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:mt-9">
              <span className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                <LockOutlined aria-hidden className="text-blue-300" />
                {t("secureCheckout")}
              </span>
              <span className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                <CarOutlined aria-hidden className="text-violet-300" />
                {t("freeShipping")}
              </span>
              <span className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                <UndoOutlined aria-hidden className="text-pink-300" />
                {t("freeReturns")}
              </span>
            </div>
          </div>

          <div className="store-card-enter relative flex justify-center [animation-delay:100ms] lg:justify-end">
            <div
              aria-hidden
              className="animate-float-slow absolute -top-8 -left-4 h-16 w-16 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/40 to-transparent backdrop-blur-sm sm:-left-8"
            />
            <div
              aria-hidden
              className="animate-float-slower absolute -right-2 -bottom-6 h-20 w-20 rounded-full border border-white/10 bg-gradient-to-br from-pink-500/40 to-transparent backdrop-blur-sm sm:-right-6"
            />
            <div className="relative w-full max-w-[470px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-500/60 via-violet-500/60 to-pink-500/60 p-[1.5px] shadow-2xl shadow-violet-950/50">
              <div className="glass-panel rounded-[calc(2rem-1.5px)] border-0 p-4 sm:p-6">
                {featuredImage ? (
                  <div className="relative overflow-hidden rounded-2xl bg-white">
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow-lg">
                      {t("featured")}
                    </span>
                    <HeroProductImage
                      src={featuredImage}
                      alt={featuredTranslation?.name || t("featuredProduct")}
                      fallback={t("featuredProduct")}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[330px] items-center justify-center rounded-2xl bg-white/5">
                    <span className="text-slate-300">
                      {t("featuredProduct")}
                    </span>
                  </div>
                )}
                {featuredProduct && (
                  <div className="mt-6 flex items-end justify-between gap-4 text-white">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-violet-300 uppercase">
                        {t("featured")}
                      </p>
                      <h2 className="mt-2 line-clamp-2 text-xl font-bold">
                        {featuredTranslation?.name}
                      </h2>
                      {featuredProduct.stock !== undefined && (
                        <p className="mt-2 text-sm text-slate-400">
                          {featuredProduct.stock > 0
                            ? t("itemsAvailable", {
                                count: featuredProduct.stock,
                              })
                            : t("outOfStock")}
                        </p>
                      )}
                    </div>
                    {featuredProduct.price && (
                      <div className="shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 px-4 py-3 text-white shadow-lg shadow-violet-900/40">
                        <p className="text-xs font-medium text-violet-100">
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
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        aria-labelledby="why-choose-us-heading"
        className="relative overflow-hidden border-b border-slate-200 bg-white"
      >
        <div
          aria-hidden
          className="absolute top-0 right-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-violet-100 to-transparent blur-2xl"
        />
        <div className="my-container relative py-14 sm:py-16 lg:py-20">
          <Reveal className="max-w-2xl">
            <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-sm font-bold tracking-[0.18em] text-transparent uppercase">
              {t("whyChooseUsEyebrow")}
            </p>
            <h2
              id="why-choose-us-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl"
            >
              {t("whyChooseUs")}
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ key, Icon, from, to, ring }, index) => (
              <Reveal key={key} delay={index * 90}>
                <div
                  className={`group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl ${ring}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${from} ${to} text-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">
                      {t(`homeBenefit${key}Title`)}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {t(`homeBenefit${key}Text`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-20 lg:gap-24">
        <section id="categories">
          <Reveal>
            <CategoriesList
              categories={categories}
              lang={locale as LocaleType}
            />
          </Reveal>
        </section>
        <Reveal>
          <FeaturedProducts lang={locale as LocaleType} />
        </Reveal>
        {categories?.map((category) => (
          <CategoryProductsList
            key={category.id}
            category={category}
            lang={locale as LocaleType}
          />
        ))}
        <Reveal>
          <HomeCallToAction settings={settings} />
        </Reveal>
      </div>
    </main>
  );
}
