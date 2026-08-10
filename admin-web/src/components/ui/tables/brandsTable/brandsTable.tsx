import { EditOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Empty, Image, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router";
import type { BrandType } from "../../../../utils/types/brandTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";
import DeleteBrand from "./components/brandDelete.tsx";
import BrandsTableColumns, {
  brandImage,
  brandTranslation,
} from "./components/brandsTableColumns.tsx";

interface Props {
  data?: BrandType[];
  loading?: boolean;
  fetchData?: () => void;
}
export default function BrandsTable({ data = [], loading, fetchData }: Props) {
  const actions = (_: unknown, brand: BrandType) => (
    <div className="management-actions">
      <Link to={`/admin/brands/edit/${brand.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <DeleteBrand
        brandId={brand.id}
        brandName={brandTranslation(brand)?.name}
        onDeleted={fetchData}
      />
    </div>
  );
  const columns = BrandsTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );
  return (
    <section
      className="management-surface"
      aria-label="Brand list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Brand directory</span>
          <h2>All brands</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "brand" : "brands"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 850 }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No brands yet"
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
          data.map((brand) => {
            const translation = brandTranslation(brand);
            const image = brandImage(brand);
            return (
              <article className="management-mobile-card" key={brand.id}>
                <div className="management-mobile-card__top">
                  {image ? (
                    <Image
                      className="management-thumb"
                      width={64}
                      height={64}
                      preview={false}
                      src={getImageSrcByBucketAndFileNames({
                        bucketName: "brands",
                        fileName: image,
                      })}
                      alt={translation?.name || "Brand"}
                    />
                  ) : (
                    <span className="management-thumb management-thumb--empty">
                      <PictureOutlined />
                    </span>
                  )}
                  <div className="management-mobile-card__identity">
                    <h3>{translation?.name || "Untitled brand"}</h3>
                    <span>{translation?.slug || `ID: ${brand.id}`}</span>
                  </div>
                </div>
                {translation?.description && (
                  <p className="management-mobile-card__description">
                    {translation.description}
                  </p>
                )}
                <div className="management-category-parent">
                  <span>Rank</span>
                  <Tag color="gold">{brand.rank ?? "Not set"}</Tag>
                </div>
                {actions(null, brand)}
              </article>
            );
          })
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No brands yet"
          />
        )}
      </div>
    </section>
  );
}
