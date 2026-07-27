import { Space, Table } from "antd";
import CategoriesTableColumns from "./components/categoriesTableColumns.tsx";
import { Link } from "react-router";
import DeleteCategory from "./components/categoryDelete.tsx";
import type { CategoryType } from "../../../../utils/types/categoryTypes.ts";

interface Props {
  data?: CategoryType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function CategoriesTable({ data, loading, fetchData }: Props) {
  return (
    <Table
      className={"w-full max-w-full overflow-x-scroll"}
      columns={CategoriesTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/categories/edit/${record.id}`}>Edit</Link>
                  <DeleteCategory
                    categoryId={record.id}
                    categoryName={record.translations?.[0]?.name}
                    onDeleted={fetchData}
                  />
                </Space>
              )
            : col?.render,
      }))}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={false}
    />
  );
}
