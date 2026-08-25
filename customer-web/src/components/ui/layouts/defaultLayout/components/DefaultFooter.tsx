"use client";

import { Link } from "@/src/i18n/navigation";
import React from "react";
import { StoreSettingsType } from "@/src/utils/types/storeSettings.type";
import { useTranslations } from "next-intl";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  LockOutlined,
  XOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

function DefaultFooter({ settings }: { settings: StoreSettingsType }) {
  const t = useTranslations();
  const socials = [
    ["Facebook", settings.facebookUrl, FacebookOutlined],
    ["Instagram", settings.instagramUrl, InstagramOutlined],
    ["X", settings.twitterUrl, XOutlined],
    ["LinkedIn", settings.linkedinUrl, LinkedinOutlined],
    ["YouTube", settings.youtubeUrl, YoutubeOutlined],
  ].filter((item): item is [string, string, typeof FacebookOutlined] =>
    Boolean(item[1]),
  );
  return (
    <footer
      id="contact"
      className="relative mt-auto w-full overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#0b0821] to-[#0b1226] text-white"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500"
      />
      <div className="my-container relative grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="max-w-md">
          <strong className="text-2xl tracking-tight text-white">
            {settings.storeName}
          </strong>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {t("homeHeroDescription")}
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-300">
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
          className="flex flex-col gap-3 text-sm text-slate-300"
        >
          <strong className="mb-2 text-xs tracking-[.14em] text-slate-500 uppercase">
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
            className="flex flex-col gap-4 text-sm"
          >
            <strong className="text-xs tracking-[.14em] text-slate-500 uppercase">
              {t("socialMedia")}
            </strong>
            <div className="flex flex-wrap gap-2.5">
              {socials.map(([label, url, Icon]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:via-violet-600 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-violet-900/30 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
                >
                  <Icon aria-hidden />
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="my-container flex flex-col-reverse items-center justify-between gap-3 py-5 text-xs text-slate-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {settings.storeName}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <LockOutlined aria-hidden />
            {t("securePayment")}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default DefaultFooter;
