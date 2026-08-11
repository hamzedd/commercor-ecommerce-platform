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
    <div className="relative flex w-full justify-center border-b border-gray-200 bg-white">
      <nav
        className="my-container flex min-h-11 w-full items-center justify-between md:py-3"
        aria-label={t("mainNavigation")}
      >
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t("home")}
          </Link>
          <Link
            href={"/#categories" as never}
            className="rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t("categories")}
          </Link>
          <Link
            href={"/#featured" as never}
            className="rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t("featured")}
          </Link>
          <Link
            href={"/#contact" as never}
            className="rounded-sm text-sm font-medium text-gray-700 transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
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
          className="flex h-11 w-11 items-center justify-center text-lg text-gray-800 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none focus-visible:ring-inset md:hidden"
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
          className="absolute top-full right-0 left-0 z-50 border-b border-gray-200 bg-white p-3 shadow-lg md:hidden"
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
