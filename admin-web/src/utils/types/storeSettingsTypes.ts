import type { UploadFile } from "antd";

export type StoreSettingsType = {
  storeName: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  currencyCode?: string;
  defaultLocale?: "en" | "ka" | "es" | "ru";
  homeMetaTitle?: string;
  homeMetaDescription?: string;
  logo?: string | UploadFile[];
  favicon?: string | UploadFile[];
  openGraphImage?: string | UploadFile[];
  removeLogo?: boolean;
  removeFavicon?: boolean;
  removeOpenGraphImage?: boolean;
};
