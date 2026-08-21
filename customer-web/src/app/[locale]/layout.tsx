import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import DefaultLayout from "@/src/components/ui/layouts/defaultLayout/DefaultLayout";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import ReactQueryProvider from "@/src/components/providers/ReactQueryProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ModalStoreProvider } from "@/src/components/providers/modalStoreProvider";
import { getStoreSettingsService } from "@/src/service/apiServices/storeSettings.service";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { StoreSettingsProvider } from "@/src/components/providers/StoreSettingsProvider";
import type { CSSProperties } from "react";
import StorefrontThemeProvider from "@/src/components/providers/StorefrontThemeProvider";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getStoreSettingsService();
  const imageUrl = (name?: string) =>
    name
      ? getImageSrcByBucketAndFileNames({
          bucketName: "commercor",
          fileName: name,
        })
      : undefined;
  const title = settings.homeMetaTitle || settings.storeName;
  const description =
    settings.homeMetaDescription || `${settings.storeName} online store`;
  const socialImage = settings.openGraphImage
    ? imageUrl(settings.openGraphImage)
    : undefined;
  const metaData: Metadata = {
    icons: { icon: "/favicon.ico" },
    title,
    description,
    openGraph: {
      type: "website",
      locale,
      title,
      description,
      siteName: settings.storeName,
      images: socialImage ? [socialImage] : [],
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : [],
    },
  };
  if (settings.favicon)
    metaData.icons = {
      icon: imageUrl(settings.favicon),
      apple: imageUrl(settings.favicon),
    };

  return metaData;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<Props>) {
  const { locale } = await params;
  const settings = await getStoreSettingsService();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html
      lang={locale}
      dir={locale === "ar" || locale === "he" ? "rtl" : "ltr"}
      style={
        {
          "--store-primary": settings.primaryColor,
          "--store-accent": settings.accentColor,
        } as CSSProperties
      }
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f0f2f5] antialiased`}
      >
        <AntdRegistry>
          <ReactQueryProvider>
            <ModalStoreProvider>
              <NextIntlClientProvider>
                <StorefrontThemeProvider>
                  <StoreSettingsProvider settings={settings}>
                    <DefaultLayout settings={settings}>
                      {children}
                    </DefaultLayout>
                  </StoreSettingsProvider>
                </StorefrontThemeProvider>
              </NextIntlClientProvider>
            </ModalStoreProvider>
          </ReactQueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
