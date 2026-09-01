"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { GlobalOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ka", name: "ქართული", flag: "🇬🇪" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export default function HeaderLanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="hidden items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none md:flex"
      >
        <GlobalOutlined className="text-base" />
        <span className="flex items-center gap-1">
          <span>{currentLanguage?.flag}</span>
          <span>{currentLanguage?.name}</span>
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Mobile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={currentLanguage?.name}
        className="flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
      >
        <GlobalOutlined className="text-sm" />
        <span>{currentLanguage?.flag}</span>
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="store-card-enter absolute end-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-violet-950/10">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={
                {
                  pathname: pathname,
                  params: params,
                } as never
              }
              locale={lang.code}
              onClick={() => setIsOpen(false)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-violet-50 ${
                locale === lang.code
                  ? "bg-gradient-to-r from-violet-50 to-blue-50 font-semibold text-violet-700"
                  : "text-slate-700"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
              {locale === lang.code && (
                <svg
                  className="ms-auto h-4 w-4 text-violet-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
