import type { ColumnsType } from "antd/es/table";
import type { OrderType } from "../../../../../utils/types/orderTypes.ts";
import type { AddressType } from "../../../../../utils/types/addressTypes.ts";
import {
  formatMoney,
  toNumber,
} from "../../../../../utils/functions/money.ts";

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
    render: (address: AddressType | undefined | null) =>
      address
        ? `${address.country}, ${address.city}, ${address.street}`
        : "Not available",
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
    render: (_, order: OrderType) =>
      formatMoney(
        order.finalTotal ??
          toNumber(order.deliveryAmount) +
            toNumber(order.productAmount) +
            toNumber(order.taxAmount),
      ),
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<OrderType>;
