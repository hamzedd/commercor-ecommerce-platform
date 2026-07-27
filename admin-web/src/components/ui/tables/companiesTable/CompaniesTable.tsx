import { Button, Space, Table } from "antd";
import CompaniesTableColumns from "./components/companiesTableColumns.tsx";
import { Link } from "react-router";
import type { CompanyDetailType } from "../../../../utils/types/companyDetailTypes.ts";
import { deleteCompanyDetailService } from "../../../../service/apiServices/companyServices.ts";

interface Props {
  data?: CompanyDetailType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function CompaniesTable({ data, loading, fetchData }: Props) {
  const handleDelete = async (id: string) => {
    await deleteCompanyDetailService(id);
    fetchData?.();
  };
  return (
    <Table
      className={"w-full"}
      columns={CompaniesTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/companies/edit/${record.id}`}>Edit</Link>
                  <Button danger onClick={() => handleDelete(record.id)}>
                    Delete
                  </Button>
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
