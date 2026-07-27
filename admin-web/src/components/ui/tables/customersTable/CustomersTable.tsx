import { Space, Table } from "antd";
import CustomersTableColumns from "./components/customersTableColumns.tsx";
import { Link } from "react-router";
import DeleteCustomer from "./components/customerDelete.tsx";
import type { CustomerType } from "../../../../utils/types/customerTypes.ts";

interface Props {
  data?: CustomerType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function CustomersTable({ data, loading, fetchData }: Props) {
  return (
    <Table
      className={"w-full"}
      columns={CustomersTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/customers/edit/${record.id}`}>Edit</Link>
                  <DeleteCustomer
                    customerId={record.id}
                    customerName={record.username}
                    onDeleted={fetchData}
                  />
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
