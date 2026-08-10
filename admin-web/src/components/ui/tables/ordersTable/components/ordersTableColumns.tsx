import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { OrderType } from "../../../../../utils/types/orderTypes.ts";

export function orderStatus(order: OrderType) {
  return order.status || order.payment?.status || "Not available";
}

export function statusColor(status: string) {
  const value = status.toLowerCase();
  if (["completed", "paid", "delivered", "success"].includes(value))
    return "success";
  if (["cancelled", "canceled", "failed", "declined"].includes(value))
    return "error";
  if (["pending", "processing", "created"].includes(value)) return "warning";
  return "default";
}

export function formatOrderDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default [
  {
    title: "Order",
    dataIndex: "id",
    key: "id",
    width: 230,
    render: (id: string | number) => (
      <div className="management-order-id">
        <strong>#{id}</strong>
        <span>Order reference</span>
      </div>
    ),
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    width: 220,
    render: (customer) => (
      <div className="management-person">
        <span className="management-person__avatar">
          {(
            customer?.firstName?.[0] ||
            customer?.username?.[0] ||
            "C"
          ).toUpperCase()}
        </span>
        <div>
          <strong>
            {[customer?.firstName, customer?.lastName]
              .filter(Boolean)
              .join(" ") ||
              customer?.username ||
              "Customer"}
          </strong>
          <span>
            {customer?.email || customer?.username || "No contact details"}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Total",
    key: "total",
    width: 130,
    render: (_, order) => (
      <strong className="management-price">
        {(order.deliveryAmount + order.productAmount).toLocaleString()}
      </strong>
    ),
  },
  {
    title: "Status",
    key: "status",
    width: 145,
    render: (_, order) => {
      const status = orderStatus(order);
      return <Tag color={statusColor(status)}>{status}</Tag>;
    },
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    width: 190,
    render: formatOrderDate,
  },
  { title: "Actions", key: "actions", width: 130, fixed: "right" },
] as ColumnsType<OrderType>;
