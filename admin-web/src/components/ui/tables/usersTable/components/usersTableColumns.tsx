import type { ColumnsType } from "antd/es/table";
import type { UserType } from "../../../../../utils/types/userTypes.ts";

export default [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: ["email"],
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<UserType>;
