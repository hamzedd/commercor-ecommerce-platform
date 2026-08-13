export const locales = ["en", "ka", "es", "ru", "ar", "he"] as const;
export type LocaleType = (typeof locales)[number];
export const defaultLocale = "en";

export const pathnames = {
  "/": "/",
  "/profile": "/profile",
  "/categories/[slug]": "/categories/[slug]",
  "/products/[slug]": "/products/[slug]",
  "/cart": "/cart",
  "/checkout": "/checkout",
  "/forgot-password": "/forgot-password",
  "/reset-password": "/reset-password",
  "/payment-status/[id]": "/payment-status/[id]",
};

export const localePrefix = "always";

export type AppPathnames = keyof typeof pathnames;
