import {
  ArrowRightOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Alert, Button, Skeleton } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../components/contexts/userContext/userContext.ts";
import { getCustomersService } from "../service/apiServices/customerServices.ts";
import { getOrdersService } from "../service/apiServices/orderServices.ts";
import { getProductsService } from "../service/apiServices/productServices.ts";
import { UserRoleEnum } from "../utils/enums/UserEnums.ts";

type Metric = {
  key: string;
  label: string;
  value: number;
  path: string;
  icon: React.ReactNode;
};

function HomePage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sources = useMemo(() => {
    const items: Array<{
      key: string;
      label: string;
      path: string;
      icon: React.ReactNode;
      load: () => Promise<unknown[]>;
    }> = [];
    if (
      [UserRoleEnum.ADMIN, UserRoleEnum.COMPANY, UserRoleEnum.SALES].includes(
        user.role,
      )
    )
      items.push({
        key: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <ShoppingCartOutlined />,
        load: getOrdersService,
      });
    if (
      [
        UserRoleEnum.ADMIN,
        UserRoleEnum.COMPANY,
        UserRoleEnum.STOCK_MANAGER,
      ].includes(user.role)
    )
      items.push({
        key: "products",
        label: "Products",
        path: "/admin/products",
        icon: <InboxOutlined />,
        load: getProductsService,
      });
    if ([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY].includes(user.role))
      items.push({
        key: "customers",
        label: "Customers",
        path: "/admin/customers",
        icon: <TeamOutlined />,
        load: getCustomersService,
      });
    return items;
  }, [user.role]);

  useEffect(() => {
    if (!user.role) return;
    let active = true;
    const loadMetrics = async () => {
      setLoading(true);
      setHasError(false);
      const results = await Promise.allSettled(
        sources.map((source) => source.load()),
      );
      if (!active) return;
      const nextMetrics = results.flatMap((result, index) =>
        result.status === "fulfilled" && Array.isArray(result.value)
          ? [{ ...sources[index], value: result.value.length }]
          : [],
      );
      setMetrics(
        nextMetrics.map((metric) => ({
          key: metric.key,
          label: metric.label,
          path: metric.path,
          icon: metric.icon,
          value: metric.value,
        })),
      );
      setHasError(results.some((result) => result.status === "rejected"));
      setLoading(false);
    };
    void loadMetrics();
    return () => {
      active = false;
    };
  }, [sources, user.role]);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-kicker">Overview</span>
          <h1>Welcome back{user.username ? `, ${user.username}` : ""}.</h1>
          <p>Monitor your catalog and operations from one focused workspace.</p>
        </div>
        {sources[0] && (
          <Link to={sources[0].path}>
            <Button type="primary" size="large">
              Open {sources[0].label.toLowerCase()} <ArrowRightOutlined />
            </Button>
          </Link>
        )}
      </section>

      {hasError && (
        <Alert
          type="warning"
          showIcon
          message="Some overview data could not be loaded"
          description="Available live totals are shown below. You can still use the navigation to manage your store."
        />
      )}

      <section aria-labelledby="store-overview-title">
        <div className="section-heading">
          <div>
            <span>Live data</span>
            <h2 id="store-overview-title">Store overview</h2>
          </div>
          <p>Current totals from your existing admin data.</p>
        </div>
        <div className="metric-grid" aria-busy={loading}>
          {loading
            ? Array.from(
                { length: Math.max(sources.length, 3) },
                (_, index) => (
                  <div className="metric-card metric-card--loading" key={index}>
                    <Skeleton
                      active
                      paragraph={{ rows: 1 }}
                      title={{ width: "55%" }}
                    />
                  </div>
                ),
              )
            : metrics.map((metric) => (
                <Link className="metric-card" to={metric.path} key={metric.key}>
                  <span className="metric-card__icon">{metric.icon}</span>
                  <span className="metric-card__label">{metric.label}</span>
                  <strong>{metric.value.toLocaleString()}</strong>
                  <span className="metric-card__action">
                    View {metric.label.toLowerCase()} <ArrowRightOutlined />
                  </span>
                </Link>
              ))}
        </div>
      </section>

      <section className="dashboard-note">
        <div>
          <span className="dashboard-note__mark">C</span>
          <div>
            <h2>Built for daily operations</h2>
            <p>
              Use the navigation to manage the areas available to your admin
              role. Your existing workflows, forms, and permissions remain in
              place.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
