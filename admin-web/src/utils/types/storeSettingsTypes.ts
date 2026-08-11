export type StoreLocale = "en" | "ka" | "es" | "ru";

export type StoreSettingsType = {
  storeName: string;
  logo?: string | null;
  favicon?: string | null;
  openGraphImage?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  primaryColor: string;
  accentColor: string;
  currencyCode: string;
  defaultLocale: StoreLocale;
  homeMetaTitle?: string | null;
  homeMetaDescription?: string | null;
};

export const defaultStoreSettings: StoreSettingsType = {
  storeName: "Commercor",
  primaryColor: "#1c1917",
  accentColor: "#d97706",
  currencyCode: "USD",
  defaultLocale: "en",
};
