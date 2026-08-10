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
    <>
      <DefaultHeaderNav />
      <DefaultHeader settings={settings} />
      {children}
      <DefaultFooter settings={settings} />
    </>
  );
}

export default DefaultLayout;
