import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { Link } from "react-router";
import { getAnalytics } from "../../service/apiServices/analyticsServices";
import type { Analytics, Metric } from "../../utils/types/analyticsTypes";
const fmt = (v: any) =>
  Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const csv = (name: string, rows: any[]) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]),
    escape = (x: any) => `"${String(x ?? "").replaceAll('"', '""')}"`,
    blob = new Blob(
      [
        [
          keys.join(","),
          ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
        ].join("\n"),
      ],
      { type: "text/csv" },
    ),
    a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
};
function Kpi({ title, m }: { title: string; m?: Metric }) {
  return (
    <Card>
      <Statistic title={title} value={m?.current || 0} precision={2} />
      <small
        className={
          Number(m?.difference) >= 0 ? "text-emerald-700" : "text-red-700"
        }
      >
        {m?.percentageChange == null
          ? "No prior baseline"
          : `${m.percentageChange}% vs previous period`}
      </small>
    </Card>
  );
}
export default function AnalyticsPage() {
  const [preset, setPreset] = useState("last_30_days"),
    [dates, setDates] = useState<any>(),
    [data, setData] = useState<Analytics>(),
    [error, setError] = useState(false);
  useEffect(() => {
    const params = {
      preset,
      start: dates?.[0]?.format("YYYY-MM-DD"),
      end: dates?.[1]?.format("YYYY-MM-DD"),
    };
    setError(false);
    getAnalytics(params)
      .then(setData)
      .catch(() => setError(true));
  }, [preset, dates]);
  if (error)
    return (
      <Card>
        <Typography.Text type="danger">
          Failed to load analytics. Please try again.
        </Typography.Text>
      </Card>
    );
  if (!data) return <Card loading />;
  return (
    <div className="flex min-w-0 w-full max-w-full flex-col gap-6 overflow-hidden">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <Typography.Text className="uppercase tracking-widest text-amber-700">
            Business intelligence
          </Typography.Text>
          <Typography.Title level={2}>Advanced analytics</Typography.Title>
        </div>
        <Space>
          <Select
            value={preset}
            onChange={setPreset}
            className="w-44"
            options={[
              "today",
              "last_7_days",
              "last_30_days",
              "last_90_days",
              "this_month",
              "previous_month",
              "custom",
            ].map((value) => ({ value, label: value.replaceAll("_", " ") }))}
          />
          {preset === "custom" && (
            <DatePicker.RangePicker onChange={setDates} />
          )}
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        {[
          ["Gross sales", "grossSales"],
          ["Net revenue", "netRevenue"],
          ["Completed orders", "completedOrders"],
          ["Average order value", "averageOrderValue"],
          ["New customers", "newCustomers"],
          ["Returning customers", "returningCustomers"],
          ["Refund amount", "refundAmount"],
          ["Units sold", "unitsSold"],
          ["Abandoned carts", "abandonedCarts"],
          ["Recovered carts", "recoveredCarts"],
        ].map(([title, key]) => (
          <Col xs={12} md={8} xl={6} key={key}>
            <Kpi title={title} m={data.kpis[key]} />
          </Col>
        ))}
      </Row>
      <Card title="Revenue over time">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data.revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bucket" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area dataKey="grossSales" stroke="#d97706" fill="#fef3c7" />
            <Area dataKey="netRevenue" stroke="#166534" fill="#dcfce7" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card
            title="Top products"
            extra={
              <Button
                onClick={() =>
                  csv("top-products.csv", data.products.topProducts)
                }
              >
                Export CSV
              </Button>
            }
          >
            <Table
              size="small"
              pagination={false}
              rowKey="productId"
              dataSource={data.products.topProducts}
              columns={[
                { title: "Product", dataIndex: "name" },
                { title: "Units", dataIndex: "units" },
                {
                  title: "Revenue",
                  render: (_: unknown, r: any) => fmt(r.revenue),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card
            title="Top customers"
            extra={
              <Button
                onClick={() =>
                  csv("top-customers.csv", data.customers.topCustomers)
                }
              >
                Export CSV
              </Button>
            }
          >
            <Table
              size="small"
              pagination={false}
              rowKey="id"
              dataSource={data.customers.topCustomers}
              columns={[
                {
                  title: "Customer",
                  render: (_: unknown, r: any) => (
                    <Link to={`/admin/customers/${r.id}`}>
                      {r.firstName} {r.lastName}
                      <br />
                      <small>{r.email}</small>
                    </Link>
                  ),
                },
                {
                  title: "Segment",
                  render: (_: unknown, r: any) => <Tag>{r.segment}</Tag>,
                },
                { title: "Orders", dataIndex: "orders" },
                {
                  title: "Range spend",
                  render: (_: unknown, r: any) => fmt(r.rangeSpend),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card
            title="Promotion and coupon usage"
            extra={
              <Button
                onClick={() =>
                  csv("promotion-performance.csv", data.promotions.promotions)
                }
              >
                Export CSV
              </Button>
            }
          >
            <Table
              size="small"
              pagination={false}
              rowKey="promotionId"
              dataSource={data.promotions.promotions}
              columns={[
                { title: "Promotion", dataIndex: "name" },
                { title: "Type", dataIndex: "type" },
                { title: "Usage", dataIndex: "usage" },
                { title: "Discount", dataIndex: "discount" },
                { title: "Order net revenue", dataIndex: "orderNetRevenue" },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Abandoned cart recovery">
            <Row gutter={12}>
              <Col span={8}>
                <Statistic
                  title="Abandoned"
                  value={data.carts.abandoned || 0}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Recovered"
                  value={data.carts.recovered || 0}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Recovery rate"
                  value={data.carts.recoveryRate || 0}
                  suffix="%"
                />
              </Col>
            </Row>
            <p className="mt-4 text-gray-500">
              Cart values are current-price estimates, not lost revenue.
            </p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Payment providers">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.payments.breakdown}>
                <XAxis dataKey="provider" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1c1917" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Store health">
            <Descriptions data={data} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
function Descriptions({ data }: { data: Analytics }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Statistic title="Points earned" value={data.loyalty.pointsEarned || 0} />
      <Statistic
        title="Points redeemed"
        value={data.loyalty.pointsRedeemed || 0}
      />
      <Statistic title="Reviews" value={data.reviews.total || 0} />
      <Statistic
        title="Average rating"
        value={data.reviews.averageRating || 0}
      />
      <Statistic title="Out of stock" value={data.inventory.outOfStock || 0} />
      <Statistic title="Low stock" value={data.inventory.lowStock || 0} />
      <Statistic
        title="Tax collected"
        value={data.payments.shipping?.tax || 0}
      />
      <Statistic
        title="Shipping collected"
        value={data.payments.shipping?.revenue || 0}
      />
    </div>
  );
}
