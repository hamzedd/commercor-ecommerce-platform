import type { ColumnsType } from "antd/es/table";
import type { CustomerType } from "../../../../../utils/types/customerTypes.ts";

export default [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (firstName: any) => firstName || "-",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    render: (lastName: any) => lastName || "-",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    render: (userName: any) => userName || "-",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: any) => email || "-",
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<CustomerType>;
