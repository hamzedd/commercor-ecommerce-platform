import { EditOutlined } from "@ant-design/icons";
import { Button, Empty, Skeleton, Table } from "antd";
import { Link } from "react-router";
import type { CustomerType } from "../../../../utils/types/customerTypes.ts";
import DeleteCustomer from "./components/customerDelete.tsx";
import CustomersTableColumns, {
  customerName,
  formatCustomerDate,
} from "./components/customersTableColumns.tsx";

interface Props {
  data?: CustomerType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function CustomersTable({
  data = [],
  loading,
  fetchData,
}: Props) {
  const actions = (_: unknown, customer: CustomerType) => (
    <div className="management-actions">
      <Link to={`/admin/customers/edit/${customer.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <DeleteCustomer
        customerId={customer.id}
        customerName={customer.username}
        onDeleted={fetchData}
      />
    </div>
  );
  const columns = CustomersTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );
  return (
    <section
      className="management-surface"
      aria-label="Customer list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Customer directory</span>
          <h2>All customers</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "customer" : "customers"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 850 }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No customers yet"
              />
            ),
          }}
        />
      </div>
      <div className="management-mobile-list">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div className="management-mobile-card" key={index}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))
        ) : data.length ? (
          data.map((customer) => (
            <article className="management-mobile-card" key={customer.id}>
              <div className="management-person management-person--mobile">
                <span className="management-person__avatar">
                  {(
                    customer.firstName?.[0] ||
                    customer.username?.[0] ||
                    "C"
                  ).toUpperCase()}
                </span>
                <div>
                  <strong>{customerName(customer)}</strong>
                  <span>@{customer.username || "no-username"}</span>
                </div>
              </div>
              <dl className="management-customer-facts">
                <div>
                  <dt>Email</dt>
                  <dd>
                    {customer.email ? (
                      <a href={`mailto:${customer.email}`}>{customer.email}</a>
                    ) : (
                      "Not available"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Joined</dt>
                  <dd>{formatCustomerDate(customer.created_at)}</dd>
                </div>
              </dl>
              {actions(null, customer)}
            </article>
          ))
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No customers yet"
          />
        )}
      </div>
    </section>
  );
}
