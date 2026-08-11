import { defineRouting } from "next-intl/routing";
import {
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
} from "@/src/i18n/config";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  localePrefix,
  pathnames,
});
