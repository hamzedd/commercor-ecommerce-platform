import React from "react";
import DefaultHeader from "@/src/components/ui/layouts/defaultLayout/components/DefaultHeader";
import DefaultHeaderNav from "@/src/components/ui/layouts/defaultLayout/components/DefaultHeaderNav";
import DefaultFooter from "@/src/components/ui/layouts/defaultLayout/components/DefaultFooter";
import { StoreSettingsType } from "@/src/utils/types/storeSettings.type";

async function DefaultLayout({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: StoreSettingsType;
}) {
  return (
    <div className="store-shell">
      <div className="store-header-stack">
        <DefaultHeaderNav />
        <DefaultHeader settings={settings} />
      </div>
      <div className="store-page">{children}</div>
      <DefaultFooter settings={settings} />
    </div>
  );
}

export default DefaultLayout;
