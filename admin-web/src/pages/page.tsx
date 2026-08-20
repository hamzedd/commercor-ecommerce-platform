import { useCallback, useEffect, useState } from "react";
import {
  AppstoreAddOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Row, Skeleton, Typography } from "antd";
import { Link } from "react-router";
import DashboardKpiCard from "../components/pageComponents/dashboard/DashboardKpiCard.tsx";
import RecentOrders from "../components/pageComponents/dashboard/RecentOrders.tsx";
import WeeklyRevenueChart from "../components/pageComponents/dashboard/WeeklyRevenueChart.tsx";
import OrderStatusChart from "../components/pageComponents/dashboard/OrderStatusChart.tsx";
import TopSellingProducts from "../components/pageComponents/dashboard/TopSellingProducts.tsx";
import { getDashboardService } from "../service/apiServices/dashboardServices.ts";
import type { DashboardType } from "../utils/types/dashboardTypes.ts";

const quickActions = [
  {
    label: "Add Product",
    description: "Create a new catalog item",
    path: "/admin/products/add",
    icon: <PlusOutlined />,
  },
  {
    label: "Add Category",
    description: "Organize the storefront",
    path: "/admin/categories/add",
    icon: <AppstoreAddOutlined />,
  },
  {
    label: "Add Brand",
    description: "Register a product brand",
    path: "/admin/brands/add",
    icon: <TagsOutlined />,
  },
  {
    label: "Manage Orders",
    description: "Review customer orders",
    path: "/admin/orders",
    icon: <ShoppingCartOutlined />,
  },
  {
    label: "Store Settings",
    description: "Update store identity",
    path: "/admin/settings",
    icon: <SettingOutlined />,
  },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat().format(value || 0);

const formatAmount = (value: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

function DashboardLoading() {
  return (
    <div className="min-h-full">
      <Skeleton active paragraph={{ rows: 2 }} />
      <Row gutter={[16, 16]} className="mt-6">
        {[0, 1, 2, 3].map((item) => (
          <Col xs={24} sm={12} xl={6} key={item}>
            <Card className="border-stone-200">
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card className="mt-6 border-stone-200">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );
}

function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      setDashboard(await getDashboardService());
    } catch {
      setError("Dashboard data could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboard) return <DashboardLoading />;

  return (
    <div className="dashboard-page min-h-full">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Typography.Text className="text-xs font-bold tracking-[0.16em] text-blue-600 uppercase">
              Commerce overview
            </Typography.Text>
            <Typography.Title
              level={1}
              className="!mt-2 !mb-1 !text-3xl !tracking-tight !text-slate-950"
            >
              Dashboard
            </Typography.Title>
            <Typography.Text className="text-stone-500">
              Live store performance and the latest order activity.
            </Typography.Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={() => void fetchDashboard()}
          >
            Refresh
          </Button>
        </div>

        {error && (
          <Alert
            className="mb-6 border-red-200"
            type="error"
            showIcon
            message="Unable to load dashboard"
            description={error}
            action={
              <Button size="small" danger onClick={() => void fetchDashboard()}>
                Retry
              </Button>
            }
          />
        )}

        {dashboard && (
          <>
            <Row gutter={[16, 16]} className="dashboard-grid">
              <Col xs={24} sm={12} xl={6}>
                <DashboardKpiCard
                  title="Total Orders"
                  value={formatNumber(dashboard.totalOrders)}
                  icon={<ShoppingCartOutlined />}
                  accent="#2563eb"
                />
              </Col>
              <Col xs={24} sm={12} xl={6}>
                <DashboardKpiCard
                  title="Pending Orders"
                  value={formatNumber(dashboard.pendingOrders)}
                  icon={<ClockCircleOutlined />}
                  accent="#d97706"
                />
              </Col>
              <Col xs={24} sm={12} xl={6}>
                <DashboardKpiCard
                  title="Low Stock Products"
                  value={formatNumber(dashboard.lowStockProducts)}
                  icon={<WarningOutlined />}
                  accent="#dc2626"
                />
              </Col>
              <Col xs={24} sm={12} xl={6}>
                <DashboardKpiCard
                  title="Revenue This Week"
                  value={formatAmount(dashboard.revenueThisWeek)}
                  icon={<DollarOutlined />}
                  accent="#16a34a"
                />
              </Col>
            </Row>

            <Row gutter={[20, 20]} className="mt-5">
              <Col xs={24} xl={16}>
                <WeeklyRevenueChart data={dashboard.weeklyRevenue} />
              </Col>
              <Col xs={24} xl={8}>
                <OrderStatusChart data={dashboard.orderStatusBreakdown} />
              </Col>
            </Row>

            <Row gutter={[20, 20]} className="mt-5">
              <Col xs={24} xl={16}>
                <RecentOrders orders={dashboard.recentOrders} />
              </Col>
              <Col xs={24} xl={8}>
                <TopSellingProducts products={dashboard.topSellingProducts} />
              </Col>
            </Row>

            <Card
              bordered={false}
              className="mt-5 border border-stone-200 shadow-sm"
              title={
                <div className="py-1">
                  <div className="text-base font-bold text-stone-900">
                    Quick Actions
                  </div>
                  <div className="text-xs font-normal text-stone-500">
                    Common management tasks
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {quickActions.map((action) => (
                  <Link key={action.path} to={action.path}>
                    <div className="group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all hover:border-blue-300 hover:bg-blue-50">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                        {action.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-stone-900">
                          {action.label}
                        </span>
                        <span className="block truncate text-xs text-stone-500">
                          {action.description}
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
