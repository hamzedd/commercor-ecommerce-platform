"use client";

import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/src/i18n/navigation";
import HeaderLanguageSwitcher from "@/src/components/ui/layouts/defaultLayout/components/HeaderLanguageSwitcher";

function DefaultHeaderNav() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="relative flex w-full justify-center overflow-hidden border-b border-white/5 bg-gradient-to-r from-[#0b0821] via-[#1e1147] to-[#0b1740] text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500"
      />
      <nav
        className="my-container relative flex min-h-10 w-full items-center justify-between"
        aria-label={t("mainNavigation")}
      >
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="rounded-sm text-xs font-semibold text-slate-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
          >
            {t("home")}
          </Link>
          <Link
            href={"/#categories" as never}
            className="rounded-sm text-xs font-semibold text-slate-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
          >
            {t("categories")}
          </Link>
          <Link
            href={"/#featured" as never}
            className="rounded-sm text-xs font-semibold text-slate-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
          >
            {t("featured")}
          </Link>
          <Link
            href={"/#contact" as never}
            className="rounded-sm text-xs font-semibold text-slate-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
          >
            {t("contact")}
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center text-lg text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none focus-visible:ring-inset md:hidden"
        >
          {isMenuOpen ? (
            <CloseOutlined aria-hidden />
          ) : (
            <MenuOutlined aria-hidden />
          )}
        </button>

        <HeaderLanguageSwitcher />
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-50 border-b border-gray-200 bg-white p-3 shadow-lg md:hidden"
        >
          <div className="my-container grid gap-1 px-0">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              {t("home")}
            </Link>
            <Link
              href={"/#categories" as never}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              {t("categories")}
            </Link>
            <Link
              href={"/#featured" as never}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              {t("featured")}
            </Link>
            <Link
              href={"/#contact" as never}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default DefaultHeaderNav;
