import { Space, Table } from "antd";
import ProductsTableColumns from "./components/productsTableColumns.tsx";
import { Link } from "react-router";
import DeleteProduct from "./components/productsDelete.tsx";
import type { ProductType } from "../../../../utils/types/productTypes.ts";

interface Props {
  data?: ProductType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function ProductsTable({ data, loading, fetchData }: Props) {
  return (
    <Table
      className={"w-full"}
      columns={ProductsTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/products/edit/${record.id}`}>Edit</Link>
                  <DeleteProduct
                    productId={record.id}
                    productName={record.translations?.[0]?.name}
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
