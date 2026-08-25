import { ArrowRightOutlined } from "@ant-design/icons";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { StoreSettingsType } from "@/src/utils/types/storeSettings.type";

interface Props {
  settings: StoreSettingsType;
}

async function HomeCallToAction({ settings }: Props) {
  const t = await getTranslations();

  return (
    <section className="my-container">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e1147] via-[#4c1d95] to-[#0b1740] px-6 py-14 text-center text-white shadow-2xl shadow-violet-950/40 sm:px-12 sm:py-16 lg:px-20">
        <div
          aria-hidden
          className="animate-blob-pulse animate-float-slow absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/30 blur-[100px]"
        />
        <div
          aria-hidden
          className="animate-blob-pulse animate-float-slower absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-pink-500/30 blur-[100px] [animation-delay:1.5s]"
        />
        <div
          aria-hidden
          className="absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.06]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <span className="glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-violet-200 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400" />
            {settings.storeName}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {t("homeCtaTitle", { storeName: settings.storeName })}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
            {t("homeCtaDescription")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
            <Link
              href={"/#categories" as never}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-[length:200%_auto] bg-[position:0%_50%] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition-all duration-300 hover:scale-[1.04] hover:bg-[position:100%_50%] hover:shadow-xl hover:shadow-pink-800/40 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1147] focus-visible:outline-none"
            >
              {t("browseCategories")}
              <ArrowRightOutlined
                aria-hidden
                data-directional-icon="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={"/#contact" as never}
              className="glass-panel inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1147] focus-visible:outline-none"
            >
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeCallToAction;
