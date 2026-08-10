import { EyeOutlined } from "@ant-design/icons";
import { Button, Empty, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router";
import type { OrderType } from "../../../../utils/types/orderTypes.ts";
import OrdersTableColumns, {
  formatOrderDate,
  orderStatus,
  statusColor,
} from "./components/ordersTableColumns.tsx";

interface Props {
  data?: OrderType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function OrdersTable({ data = [], loading }: Props) {
  const actions = (_: unknown, order: OrderType) => (
    <div className="management-actions">
      <Link to={`/admin/orders/${order.id}`}>
        <Button type="text" icon={<EyeOutlined />}>
          View
        </Button>
      </Link>
    </div>
  );
  const columns = OrdersTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );
  return (
    <section
      className="management-surface"
      aria-label="Order list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Order queue</span>
          <h2>All orders</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "order" : "orders"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1045 }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No orders yet"
              />
            ),
          }}
        />
      </div>
      <div className="management-mobile-list">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div className="management-mobile-card" key={index}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))
        ) : data.length ? (
          data.map((order) => {
            const status = orderStatus(order);
            const customerName =
              [order.customer?.firstName, order.customer?.lastName]
                .filter(Boolean)
                .join(" ") ||
              order.customer?.username ||
              "Customer";
            return (
              <article className="management-mobile-card" key={order.id}>
                <div className="management-order-card__heading">
                  <div className="management-order-id">
                    <strong>#{order.id}</strong>
                    <span>{formatOrderDate(order.created_at)}</span>
                  </div>
                  <Tag color={statusColor(status)}>{status}</Tag>
                </div>
                <div className="management-person management-person--mobile">
                  <span className="management-person__avatar">
                    {(
                      order.customer?.firstName?.[0] ||
                      order.customer?.username?.[0] ||
                      "C"
                    ).toUpperCase()}
                  </span>
                  <div>
                    <strong>{customerName}</strong>
                    <span>
                      {order.customer?.email ||
                        order.customer?.username ||
                        "No contact details"}
                    </span>
                  </div>
                </div>
                <dl className="management-mobile-card__facts">
                  <div>
                    <dt>Order total</dt>
                    <dd>
                      {(
                        order.deliveryAmount + order.productAmount
                      ).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt>Items</dt>
                    <dd>{order.orderItems?.length ?? 0}</dd>
                  </div>
                </dl>
                {actions(null, order)}
              </article>
            );
          })
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No orders yet"
          />
        )}
      </div>
    </section>
  );
}
