import { Space, Table } from "antd";
import OrdersTableColumns from "./components/ordersTableColumns.tsx";
import { Link } from "react-router";
import type { OrderType } from "../../../../utils/types/orderTypes.ts";

interface Props {
  data?: OrderType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function OrdersTable({ data, loading }: Props) {
  return (
    <Table
      className={"w-full"}
      columns={OrdersTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/orders/${record.id}`}>Preview</Link>
                </Space>
              )
            : col?.render,
      }))}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 8 }}
    />
  );
}
