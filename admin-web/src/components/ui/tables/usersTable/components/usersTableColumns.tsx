import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import type { UserType } from "../../../../../utils/types/userTypes.ts";

export default [
  {
    title: "Admin user",
    dataIndex: "username",
    key: "username",
    render: (username: string) => (
      <div className="management-person">
        <span className="management-person__avatar">
          {(username?.[0] || "U").toUpperCase()}
        </span>
        <div>
          <strong>{username || "Unnamed user"}</strong>
          <span>Administrative account</span>
        </div>
      </div>
    ),
  },
  {
    title: "Email",
    dataIndex: ["email"],
    key: "email",
    render: (email: string) =>
      email ? <a href={`mailto:${email}`}>{email}</a> : "Not available",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: string) => (
      <Tag color="gold">
        {role ? role.replaceAll("_", " ").toLowerCase() : "Not assigned"}
      </Tag>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    width: 190,
  },
] as ColumnsType<UserType>;
