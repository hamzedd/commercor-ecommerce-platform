import type { ColumnsType } from "antd/es/table";
import type { OrderType } from "../../../../../utils/types/orderTypes.ts";
import type { AddressType } from "../../../../../utils/types/addressTypes.ts";

export default [
  {
    title: "Customer username",
    dataIndex: ["customer", "username"],
    key: "customer",
  },
  {
    title: "Address",
    dataIndex: ["address"],
    key: "address",
    render: (address: AddressType) =>
      address.country + ", " + address.city + ", " + address.street,
  },
  {
    title: "Status",
    dataIndex: ["status"],
    key: "status",
  },
  {
    title: "Amount",
    dataIndex: ["amount"],
    key: "amount",
    render: (_, order: OrderType) => order.finalTotal ?? order.deliveryAmount + order.productAmount + (order.taxAmount || 0),
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<OrderType>;
