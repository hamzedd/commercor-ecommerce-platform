"use client";

import { ConfigProvider } from "antd";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

export default function StorefrontThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();
  return (
    <ConfigProvider
      direction={locale === "ar" || locale === "he" ? "rtl" : "ltr"}
      theme={{
        token: {
          colorPrimary: "var(--store-primary)",
          colorText: "#172033",
          colorTextSecondary: "#667085",
          colorBorder: "#e4e7ec",
          colorBgLayout: "#f7f8fa",
          borderRadius: 10,
          borderRadiusLG: 16,
          controlHeight: 42,
          fontFamily:
            "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
          boxShadowSecondary: "0 18px 48px rgba(16,24,40,.12)",
        },
        components: {
          Button: { borderRadius: 10, fontWeight: 650, primaryShadow: "none" },
          Modal: { borderRadiusLG: 18 },
          Drawer: { colorBgElevated: "#fff" },
          Tabs: {
            inkBarColor: "var(--store-accent)",
            itemSelectedColor: "var(--store-primary)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
