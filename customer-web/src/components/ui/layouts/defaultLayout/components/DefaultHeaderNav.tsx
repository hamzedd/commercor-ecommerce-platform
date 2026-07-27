import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import HeaderLanguageSwitcher from "@/src/components/ui/layouts/defaultLayout/components/HeaderLanguageSwitcher";

async function DefaultHeaderNav() {
  const t = await getTranslations();

  return (
    <div
      className={
        "flex w-full items-center justify-center border-b border-gray-200 bg-white shadow-sm"
      }
    >
      <nav className="my-container flex items-center justify-between gap-4 py-3 md:py-4">
        {/* Left side - Navigation Links */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            className={
              "text-sm font-medium text-gray-700 transition-colors hover:text-black md:text-base"
            }
            href={"/"}
          >
            {t("home")}
          </Link>
        </div>

        {/* Right side - Language Switcher */}
        <HeaderLanguageSwitcher />
      </nav>
    </div>
  );
}

export default DefaultHeaderNav;
