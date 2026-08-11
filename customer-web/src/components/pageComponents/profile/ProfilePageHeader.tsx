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
        <div
          className={
            "flex items-center justify-center rounded-full bg-black p-4"
          }
        >
          <UserOutlined style={{ fontSize: 24, color: "#fff" }} />
        </div>
        <h1 className={"text-xl font-bold uppercase"}>
          {t("hello")}, {data?.firstName} {data?.lastName}
        </h1>
      </div>
    </div>
  );
}

export default ProfilePageHeader;
