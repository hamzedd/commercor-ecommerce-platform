import { Card, Empty } from "antd";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { OrderStatusBreakdownType } from "../../../utils/types/dashboardTypes.ts";

const statusColors: Record<string, string> = {
  completed: "#16a34a",
  delivered: "#16a34a",
  paid: "#16a34a",
  pending: "#d97706",
  processing: "#2563eb",
  shipped: "#0891b2",
  cancelled: "#dc2626",
  canceled: "#dc2626",
  failed: "#dc2626",
  declined: "#dc2626",
  refunded: "#78716c",
};
const fallbackColors = ["#1c1917", "#a16207", "#57534e", "#ca8a04", "#44403c"];

const formatStatus = (status: string) =>
  status
    .replace(/[_-]+/g, " ")
    .replace(/w/g, (character) => character.toUpperCase());

function OrderStatusChart({ data }: { data: OrderStatusBreakdownType[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card
      bordered={false}
      className="h-full border border-stone-200 shadow-sm"
      title={
        <div className="py-1">
          <div className="text-base font-bold text-stone-900">Order Status</div>
          <div className="text-xs font-normal text-stone-500">
            Current order distribution
          </div>
        </div>
      }
    >
      {data.length === 0 ? (
        <Empty
          className="py-16"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No order statuses"
        />
      ) : (
        <>
          <div className="relative mx-auto h-[210px] max-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.status}
                      fill={
                        statusColors[item.status.toLowerCase()] ||
                        fallbackColors[index % fallbackColors.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    Number(value).toLocaleString(),
                    formatStatus(String(name)),
                  ]}
                  contentStyle={{
                    border: "1px solid #e7e5e4",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-stone-900">
                {total.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400">orders</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {data.map((item, index) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        statusColors[item.status.toLowerCase()] ||
                        fallbackColors[index % fallbackColors.length],
                    }}
                  />
                  <span className="truncate text-sm text-stone-600">
                    {formatStatus(item.status)}
                  </span>
                </span>
                <span className="font-semibold text-stone-900">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export default OrderStatusChart;
