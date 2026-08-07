import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import HeaderLanguageSwitcher from "@/src/components/ui/layouts/defaultLayout/components/HeaderLanguageSwitcher";

async function DefaultHeaderNav() {
  const t = await getTranslations();

  return (
    <div className="flex w-full justify-center border-b border-gray-200 bg-white">
      <nav className="my-container flex w-full items-center justify-between py-3">
        <div className="flex items-center gap-5 md:gap-7">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
          >
            {t("home")}
          </Link>

          <a
            href="/#categories"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
          >
            Categories
          </a>

          <a
            href="/#featured"
            className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-black sm:inline"
          >
            Featured
          </a>

          <a
            href="/#contact"
            className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-black md:inline"
          >
            Contact
          </a>
        </div>

        <HeaderLanguageSwitcher />
      </nav>
    </div>
  );
}

export default DefaultHeaderNav;