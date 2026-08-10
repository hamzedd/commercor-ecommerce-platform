import type { ColumnsType } from "antd/es/table";
import type { CustomerType } from "../../../../../utils/types/customerTypes.ts";

export function customerName(customer: CustomerType) {
  return (
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.username ||
    "Unnamed customer"
  );
}

export function formatCustomerDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export default [
  {
    title: "Customer",
    key: "customer",
    width: 300,
    render: (_, customer) => (
      <div className="management-person">
        <span className="management-person__avatar">
          {(
            customer.firstName?.[0] ||
            customer.username?.[0] ||
            "C"
          ).toUpperCase()}
        </span>
        <div>
          <strong>{customerName(customer)}</strong>
          <span>@{customer.username || "no-username"}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email?: string) =>
      email ? (
        <a className="management-email" href={`mailto:${email}`}>
          {email}
        </a>
      ) : (
        <span className="management-description">Not available</span>
      ),
  },
  {
    title: "Joined",
    dataIndex: "created_at",
    key: "created_at",
    width: 170,
    render: formatCustomerDate,
  },
  { title: "Actions", key: "actions", width: 180, fixed: "right" },
] as ColumnsType<CustomerType>;
