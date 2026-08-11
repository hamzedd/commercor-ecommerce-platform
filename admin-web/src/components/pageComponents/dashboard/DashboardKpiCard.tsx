import { Card, Typography } from "antd";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  accent: string;
}

function DashboardKpiCard({ title, value, icon, accent }: Props) {
  return (
    <Card
      bordered={false}
      className="h-full overflow-hidden border border-stone-200 shadow-sm"
      styles={{ body: { padding: 22 } }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Typography.Text className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">
            {title}
          </Typography.Text>
          <div className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {value}
          </div>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: accent + "18", color: accent }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default DashboardKpiCard;
