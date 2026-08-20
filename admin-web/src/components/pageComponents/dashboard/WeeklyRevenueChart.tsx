import { Card, Typography } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyRevenueType } from "../../../utils/types/dashboardTypes.ts";

const formatAmount = (value: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function WeeklyRevenueChart({ data }: { data: WeeklyRevenueType[] }) {
  const hasRevenue = data.some((item) => item.revenue > 0);

  return (
    <Card
      bordered={false}
      className="chart-reveal h-full border border-slate-200 shadow-sm"
      title={
        <div className="py-1">
          <div className="text-base font-bold text-stone-900">
            Weekly Revenue
          </div>
          <div className="text-xs font-normal text-stone-500">
            Completed payment revenue · Monday–Sunday UTC
          </div>
        </div>
      }
    >
      <div className="h-[280px] w-full min-w-0 sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.26} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#e7e5e4"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#78716c", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#78716c", fontSize: 11 }}
              tickFormatter={(value: number) =>
                new Intl.NumberFormat(undefined, {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip
              cursor={{ stroke: "#d6d3d1", strokeDasharray: "4 4" }}
              contentStyle={{
                border: "1px solid #e7e5e4",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(28, 25, 23, 0.12)",
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ""}
              formatter={(value) => [formatAmount(Number(value)), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, fill: "#2563eb", stroke: "#bfdbfe" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!hasRevenue && (
        <Typography.Text className="block text-center text-xs text-stone-400">
          No completed revenue recorded for this week.
        </Typography.Text>
      )}
    </Card>
  );
}

export default WeeklyRevenueChart;
