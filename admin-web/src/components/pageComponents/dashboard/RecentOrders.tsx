import {
  ArrowRightOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Grid, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router";
import type { DashboardOrderType } from "../../../utils/types/dashboardTypes.ts";
import OrderStatusTag from "./OrderStatusTag.tsx";

const formatAmount = (amount: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function Customer({ order }: { order: DashboardOrderType }) {
  return (
    <div className="min-w-0">
      <div className="truncate font-semibold text-stone-900">
        {order.customerName || "Guest customer"}
      </div>
      {order.customerEmail && (
        <div className="truncate text-xs text-stone-500">
          {order.customerEmail}
        </div>
      )}
    </div>
  );
}

function RecentOrders({ orders }: { orders: DashboardOrderType[] }) {
  const screens = Grid.useBreakpoint();
  const columns: ColumnsType<DashboardOrderType> = [
    {
      title: "Order",
      key: "reference",
      render: (_, order) => (
        <Link
          className="font-semibold text-stone-900 hover:text-amber-700"
          to={"/admin/orders/" + order.id}
        >
          #{order.reference.slice(0, 8)}
        </Link>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, order) => <Customer order={order} />,
    },
    {
      title: "Items",
      dataIndex: "itemCount",
      key: "itemCount",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <OrderStatusTag status={status} />,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <span className="whitespace-nowrap text-stone-600">
          {formatDate(createdAt)}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount: number) => (
        <span className="font-semibold text-stone-900">
          {formatAmount(amount)}
        </span>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      className="border border-stone-200 shadow-sm"
      styles={{ body: { padding: 0 } }}
      title={
        <div className="flex items-center gap-3 py-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-amber-400">
            <ShoppingOutlined />
          </span>
          <div>
            <div className="text-base font-bold text-stone-900">
              Recent Orders
            </div>
            <div className="text-xs font-normal text-stone-500">
              The six newest orders
            </div>
          </div>
        </div>
      }
      extra={
        <Link to="/admin/orders">
          <Button type="text" className="font-semibold">
            View all <ArrowRightOutlined />
          </Button>
        </Link>
      }
    >
      {orders.length === 0 ? (
        <Empty
          className="py-14"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No orders yet"
        />
      ) : screens.md ? (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          pagination={false}
          scroll={{ x: 860 }}
        />
      ) : (
        <div className="divide-y divide-stone-100">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={"/admin/orders/" + order.id}
              className="block p-4 transition-colors hover:bg-stone-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 font-bold text-stone-900">
                    #{order.reference.slice(0, 8)}
                  </div>
                  <Customer order={order} />
                </div>
                <OrderStatusTag status={order.status} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-stone-400">Items</div>
                  <div className="mt-1 font-semibold text-stone-700">
                    {order.itemCount}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Created</div>
                  <div className="mt-1 font-semibold text-stone-700">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-stone-400">Total</div>
                  <div className="mt-1 font-bold text-stone-900">
                    {formatAmount(order.totalAmount)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentOrders;
