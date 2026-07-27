import { Space, Table } from "antd";
import { Link } from "react-router";
import BrandsTableColumns from "./components/brandsTableColumns";
import DeleteBrand from "./components/brandDelete";
import type { BrandType } from "../../../../utils/types/brandTypes.ts";

interface Props {
  data?: BrandType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function BrandsTable({ data, loading, fetchData }: Props) {
  return (
    <Table
      className={"w-full"}
      columns={BrandsTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/brands/edit/${record.id}`}>Edit</Link>
                  <DeleteBrand
                    brandId={record.id}
                    brandName={record.translations?.[0]?.name}
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
