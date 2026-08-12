"use client";

import { Tabs, TabsProps } from "antd";
import ProfilePageInfoTab from "@/src/components/pageComponents/profile/ProfilePageInfoTab";
import ProfilePageAddressesTab from "@/src/components/pageComponents/profile/ProfilePageAddressesTab";
import ProfilePageOrdersTab from "@/src/components/pageComponents/profile/ProfilePageOrdersTab";
import ProfilePageRewardsTab from "@/src/components/pageComponents/profile/ProfilePageRewardsTab";
import { useTranslations } from "next-intl";

function ProfilePageTabs() {
  const t = useTranslations();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("profileInfo"),
      children: <ProfilePageInfoTab />,
    },
    {
      key: "2",
      label: t("orders"),
      children: <ProfilePageOrdersTab />,
    },
    {
      key: "3",
      label: t("addresses"),
      children: <ProfilePageAddressesTab />,
    },
    { key: "4", label: "Rewards", children: <ProfilePageRewardsTab /> },
  ];

  return (
    <div className={"my-container flex flex-col gap-5"}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default ProfilePageTabs;
