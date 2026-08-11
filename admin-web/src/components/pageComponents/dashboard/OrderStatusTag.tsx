import { Tag } from "antd";

const statusColors: Record<string, string> = {
  completed: "green",
  delivered: "green",
  paid: "green",
  pending: "gold",
  processing: "blue",
  shipped: "cyan",
  cancelled: "red",
  canceled: "red",
  failed: "red",
  declined: "red",
  refunded: "default",
};

function OrderStatusTag({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase() || "unknown";
  return (
    <Tag
      color={statusColors[normalizedStatus] || "default"}
      className="m-0 rounded-full px-2.5 py-0.5 font-medium capitalize"
    >
      {normalizedStatus}
    </Tag>
  );
}

export default OrderStatusTag;
