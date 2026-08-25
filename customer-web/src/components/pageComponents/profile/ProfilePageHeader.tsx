"use client";

import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { UserOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

function ProfilePageHeader() {
  const t = useTranslations();
  const { data } = useCurrentUserQuery();

  return (
    <div className={"my-container flex flex-col gap-5"}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-pink-600 p-4 shadow-md shadow-violet-900/20">
          <UserOutlined style={{ fontSize: 24, color: "#fff" }} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">
          {t("hello")}, {data?.firstName} {data?.lastName}
        </h1>
      </div>
    </div>
  );
}

export default ProfilePageHeader;
