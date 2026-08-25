import React from "react";
import ProfilePageHeader from "@/src/components/pageComponents/profile/ProfilePageHeader";
import ProfilePageTabs from "@/src/components/pageComponents/profile/ProfilePageTabs";

function Page() {
  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="my-container flex w-full flex-col items-center">
        <ProfilePageHeader></ProfilePageHeader>
        <ProfilePageTabs></ProfilePageTabs>
      </div>
    </main>
  );
}

export default Page;
