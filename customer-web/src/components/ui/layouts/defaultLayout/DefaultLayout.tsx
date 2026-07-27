import React from "react";
import DefaultHeader from "@/src/components/ui/layouts/defaultLayout/components/DefaultHeader";
import DefaultHeaderNav from "@/src/components/ui/layouts/defaultLayout/components/DefaultHeaderNav";
import { getCompanyDetailByKeyService } from "@/src/service/apiServices/companyDetail.service";
import { CompanyDetailEnum } from "@/src/utils/enums/CompanyDetail.enum";

async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const logo = await getCompanyDetailByKeyService(CompanyDetailEnum.LOGO);
  return (
    <>
      <DefaultHeaderNav />
      <DefaultHeader logo={logo} />
      {children}
      {/*<DefaultFooter></DefaultFooter>*/}
    </>
  );
}

export default DefaultLayout;
