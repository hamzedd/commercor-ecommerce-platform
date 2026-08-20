import { Link } from "@/src/i18n/navigation";
import React from "react";
import { StoreSettingsType } from "@/src/utils/types/storeSettings.type";
import { useTranslations } from "next-intl";

function DefaultFooter({ settings }: { settings: StoreSettingsType }) {
  const t = useTranslations();
  const socials = [
    ["Facebook", settings.facebookUrl],
    ["Instagram", settings.instagramUrl],
    ["X / Twitter", settings.twitterUrl],
    ["LinkedIn", settings.linkedinUrl],
    ["YouTube", settings.youtubeUrl],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  return (
    <footer
      id="contact"
      className="mt-auto w-full border-t border-stone-800 bg-stone-950 text-white"
    >
      <div className="my-container grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="max-w-md">
          <strong className="text-2xl tracking-tight text-white">
            {settings.storeName}
          </strong>
          <p className="mt-3 text-sm leading-6 text-stone-400">
            {t("homeHeroDescription")}
          </p>
          <div className="mt-6 space-y-2 text-sm text-stone-300">
            {settings.contactEmail && (
              <a
                className="block transition-colors hover:text-white"
                href={`mailto:${settings.contactEmail}`}
              >
                {settings.contactEmail}
              </a>
            )}
            {settings.phone && (
              <a
                className="block transition-colors hover:text-white"
                href={`tel:${settings.phone}`}
              >
                {settings.phone}
              </a>
            )}
            {settings.address && (
              <address className="not-italic">{settings.address}</address>
            )}
          </div>
        </div>
        <nav
          aria-label={t("mainNavigation")}
          className="flex flex-col gap-3 text-sm text-stone-300"
        >
          <strong className="mb-2 text-xs tracking-[.14em] text-stone-500 uppercase">
            {t("mainNavigation")}
          </strong>
          <Link href={"/"} className="transition-colors hover:text-white">
            {t("home")}
          </Link>
          <Link
            href={"/#categories" as never}
            className="transition-colors hover:text-white"
          >
            {t("aboutUs")}
          </Link>
          <Link
            href={"/#contact" as never}
            className="transition-colors hover:text-white"
          >
            {t("contactUs")}
          </Link>
        </nav>
        {socials.length > 0 && (
          <nav
            aria-label={t("socialMedia")}
            className="flex flex-col gap-3 text-sm"
          >
            <strong className="mb-2 text-xs tracking-[.14em] text-stone-500 uppercase">
              {t("socialMedia")}
            </strong>
            {socials.map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-stone-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--store-accent)] focus-visible:outline-none"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="my-container py-5 text-xs text-stone-500">
          © {new Date().getFullYear()} {settings.storeName}
        </div>
      </div>
    </footer>
  );
}

export default DefaultFooter;
