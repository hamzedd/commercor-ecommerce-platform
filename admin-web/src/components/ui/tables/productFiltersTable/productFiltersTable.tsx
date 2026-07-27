import { Space, Table } from "antd";
import ProductFiltersTableColumns from "./components/productFiltersTableColumns.tsx";
import { Link } from "react-router";
import DeleteProductFilter from "./components/productFilterDelete.tsx";
import type { ProductFilterType } from "../../../../utils/types/productFilterTypes.ts";

interface Props {
  data?: ProductFilterType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function ProductFiltersTable({
  data = [],
  loading = false,
  fetchData,
}: Props) {
  const cols = ProductFiltersTableColumns.map((col) => ({
    ...col,
    render:
      col.key === "actions"
        ? (_: any, record: ProductFilterType) => (
            <Space>
              <Link to={`/admin/product-filter/edit/${record.id}`}>Edit</Link>
              <DeleteProductFilter
                productFilterId={record.id}
                productFilterName={record.translations?.[0]?.name}
                onDeleted={fetchData}
              />
            </Space>
          )
        : col?.render,
  }));

  return (
    <Table
      className={"w-full"}
      columns={cols}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 8 }}
    />
  );
}
