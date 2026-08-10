export type StoreSettingsType = {
  storeName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  primaryColor: string;
  accentColor: string;
  currencyCode: string;
  defaultLocale: "en" | "ka" | "es" | "ru";
  homeMetaTitle?: string;
  homeMetaDescription?: string;
  openGraphImage?: string;
};

export const defaultStoreSettings: StoreSettingsType = {
  storeName: "Commercor",
  primaryColor: "#1c1917",
  accentColor: "#d97706",
  currencyCode: "USD",
  defaultLocale: "en",
};
