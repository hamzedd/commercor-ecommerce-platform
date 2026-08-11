import React from "react";
import ProfilePageHeader from "@/src/components/pageComponents/profile/ProfilePageHeader";
import ProfilePageTabs from "@/src/components/pageComponents/profile/ProfilePageTabs";

function Page() {
  return (
    <div className={"flex w-full flex-col items-center py-5"}>
      <ProfilePageHeader></ProfilePageHeader>
      <ProfilePageTabs></ProfilePageTabs>
    </div>
  );
}

export default Page;
