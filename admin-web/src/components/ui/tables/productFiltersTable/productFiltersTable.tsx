import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Empty, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router";
import type { ProductFilterType } from "../../../../utils/types/productFilterTypes.ts";
import DeleteProductFilter from "./components/productFilterDelete.tsx";
import ProductFiltersTableColumns, {
  categoryName,
  filterTranslation,
} from "./components/productFiltersTableColumns.tsx";

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
  const actions = (_: unknown, filter: ProductFilterType) => (
    <div className="management-actions">
      <Link to={`/admin/product-filter/edit/${filter.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <DeleteProductFilter
        productFilterId={filter.id}
        productFilterName={filterTranslation(filter)?.name}
        onDeleted={fetchData}
      />
    </div>
  );
  const columns = ProductFiltersTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );
  return (
    <section
      className="management-surface"
      aria-label="Product filter list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Filter configuration</span>
          <h2>All product filters</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "filter" : "filters"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1060 }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No product filters yet"
              />
            ),
          }}
        />
      </div>
      <div className="management-mobile-list">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div className="management-mobile-card" key={index}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))
        ) : data.length ? (
          data.map((filter) => {
            const translation = filterTranslation(filter);
            return (
              <article className="management-mobile-card" key={filter.id}>
                <div className="management-filter-card__heading">
                  <span className="management-detail-icon">
                    <FilterOutlined />
                  </span>
                  <div className="management-mobile-card__identity">
                    <h3>{translation?.name || "Untitled filter"}</h3>
                    <span>{translation?.slug || `ID: ${filter.id}`}</span>
                  </div>
                  <Tag color="gold">{filter.type || "Not set"}</Tag>
                </div>
                <div className="management-category-parent">
                  <span>Categories</span>
                  <div className="management-tag-list">
                    {filter.categories?.length ? (
                      filter.categories.map((category) => (
                        <Tag key={category.id}>{categoryName(category)}</Tag>
                      ))
                    ) : (
                      <Tag>Unassigned</Tag>
                    )}
                  </div>
                </div>
                <div className="management-category-parent management-category-parent--stacked">
                  <span>Languages</span>
                  <div className="management-tag-list">
                    {filter.translations?.map((item) => (
                      <Tag key={item.id}>{item.lang}</Tag>
                    ))}
                  </div>
                </div>
                {actions(null, filter)}
              </article>
            );
          })
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No product filters yet"
          />
        )}
      </div>
    </section>
  );
}
