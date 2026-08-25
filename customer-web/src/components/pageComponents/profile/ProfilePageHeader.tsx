"use client";

import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { UserOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

function ProfilePageHeader() {
  const t = useTranslations();
  const { data } = useCurrentUserQuery();

  return (
    <div className="store-card-enter my-container flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-pink-600 shadow-md shadow-violet-900/20">
          <UserOutlined style={{ fontSize: 22, color: "#fff" }} />
        </div>
        <div>
          <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-xs font-bold tracking-[0.16em] text-transparent uppercase">
            {t("profileInfo")}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {t("hello")}, {data?.firstName} {data?.lastName}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageHeader;
