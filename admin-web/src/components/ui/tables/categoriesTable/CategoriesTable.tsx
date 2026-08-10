import { EditOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Empty, Image, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router";
import type {
  CategoryTranslationType,
  CategoryType,
} from "../../../../utils/types/categoryTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";
import DeleteCategory from "./components/categoryDelete.tsx";
import CategoriesTableColumns from "./components/categoriesTableColumns.tsx";

interface Props {
  data?: CategoryType[];
  loading?: boolean;
  fetchData?: () => void;
}

function preferredTranslation(
  category: CategoryType,
): CategoryTranslationType | undefined {
  return (
    category.translations?.find((item) => item.lang?.toLowerCase() === "en") ??
    category.translations?.[0]
  );
}

export default function CategoriesTable({
  data = [],
  loading,
  fetchData,
}: Props) {
  const actions = (_: unknown, record: CategoryType) => (
    <div className="management-actions">
      <Link to={`/admin/categories/edit/${record.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <DeleteCategory
        categoryId={record.id}
        categoryName={preferredTranslation(record)?.name}
        onDeleted={fetchData}
      />
    </div>
  );
  const columns = CategoriesTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );

  return (
    <section
      className="management-surface"
      aria-label="Category list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Organization</span>
          <h2>All categories</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "category" : "categories"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No categories yet"
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
          data.map((category) => {
            const translation = preferredTranslation(category);
            return (
              <article className="management-mobile-card" key={category.id}>
                <div className="management-mobile-card__top">
                  {category.image ? (
                    <Image
                      className="management-thumb"
                      width={64}
                      height={64}
                      preview={false}
                      src={getImageSrcByBucketAndFileNames({
                        bucketName: "categories",
                        fileName: category.image,
                      })}
                      alt={translation?.name || "Category"}
                    />
                  ) : (
                    <span className="management-thumb management-thumb--empty">
                      <PictureOutlined />
                    </span>
                  )}
                  <div className="management-mobile-card__identity">
                    <h3>{translation?.name || "Untitled category"}</h3>
                    <span>{translation?.slug || `ID: ${category.id}`}</span>
                  </div>
                </div>
                {translation?.description && (
                  <p className="management-mobile-card__description">
                    {translation.description}
                  </p>
                )}
                <div className="management-category-parent">
                  <span>Hierarchy</span>
                  <Tag>
                    {category.parentId ? "Child category" : "Top level"}
                  </Tag>
                </div>
                {actions(null, category)}
              </article>
            );
          })
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No categories yet"
          />
        )}
      </div>
    </section>
  );
}
