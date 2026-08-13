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
    <footer className="mt-auto flex w-full justify-center border-t border-stone-200 bg-white py-8 md:py-10">
      <div className="my-container grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
        <div>
          <strong className="text-xl text-stone-950">
            {settings.storeName}
          </strong>
          <div className="mt-3 space-y-1 text-sm text-stone-600">
            {settings.contactEmail && (
              <a
                className="block hover:text-[var(--store-accent)]"
                href={`mailto:${settings.contactEmail}`}
              >
                {settings.contactEmail}
              </a>
            )}
            {settings.phone && (
              <a
                className="block hover:text-[var(--store-accent)]"
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
        <div className="flex flex-col gap-3 md:gap-5">
          <Link href={"/"} className="hover:underline">
            {t("home")}
          </Link>
          <Link href={"/"} className="hover:underline">
            {t("aboutUs")}
          </Link>
          <Link href={"/"} className="hover:underline">
            {t("contactUs")}
          </Link>
        </div>
        {socials.length > 0 && (
          <nav aria-label={t("socialMedia")} className="flex flex-col gap-3">
            {socials.map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-stone-600 hover:text-[var(--store-accent)] focus-visible:ring-2 focus-visible:ring-[var(--store-accent)] focus-visible:outline-none"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}

export default DefaultFooter;
