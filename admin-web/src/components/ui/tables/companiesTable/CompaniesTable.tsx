import {
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Button, Empty, Image, Skeleton, Table } from "antd";
import { Link } from "react-router";
import type { CompanyDetailType } from "../../../../utils/types/companyDetailTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";
import { deleteCompanyDetailService } from "../../../../service/apiServices/companyServices.ts";
import CompaniesTableColumns, {
  companyLabel,
} from "./components/companiesTableColumns.tsx";

interface Props {
  data?: CompanyDetailType[];
  loading?: boolean;
  fetchData?: () => void;
}
export default function CompaniesTable({
  data = [],
  loading,
  fetchData,
}: Props) {
  const handleDelete = async (id: string) => {
    await deleteCompanyDetailService(id);
    fetchData?.();
  };
  const actions = (_: unknown, company: CompanyDetailType) => (
    <div className="management-actions">
      <Link to={`/admin/companies/edit/${company.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => void handleDelete(company.id)}
      >
        Delete
      </Button>
    </div>
  );
  const columns = CompaniesTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );
  return (
    <section
      className="management-surface"
      aria-label="Company detail list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Store information</span>
          <h2>Company details</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "detail" : "details"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 820 }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No company details yet"
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
          data.map((company) => (
            <article className="management-mobile-card" key={company.id}>
              <div className="management-mobile-card__top">
                {company.image ? (
                  <Image
                    className="management-thumb"
                    width={64}
                    height={64}
                    preview={false}
                    src={getImageSrcByBucketAndFileNames({
                      bucketName: "commercor",
                      fileName: company.image,
                    })}
                    alt={`${companyLabel(company.key)} company detail`}
                  />
                ) : (
                  <span className="management-thumb management-thumb--empty">
                    <FileImageOutlined />
                  </span>
                )}
                <div className="management-mobile-card__identity">
                  <h3>{companyLabel(company.key)}</h3>
                  <span>{company.key}</span>
                </div>
              </div>
              <p className="management-mobile-card__description">
                {company.value || "No text value"}
              </p>
              {actions(null, company)}
            </article>
          ))
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No company details yet"
          />
        )}
      </div>
    </section>
  );
}
