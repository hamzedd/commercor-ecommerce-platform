import { EditOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Empty, Image, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router";
import type {
  ProductTranslationType,
  ProductType,
} from "../../../../utils/types/productTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";
import DeleteProduct from "./components/productsDelete.tsx";
import ProductsTableColumns from "./components/productsTableColumns.tsx";

interface Props {
  data?: ProductType[];
  loading?: boolean;
  fetchData?: () => void;
}

function preferredTranslation(
  product: ProductType,
): ProductTranslationType | undefined {
  return (
    product.translations?.find((item) => item.lang?.toLowerCase() === "en") ??
    product.translations?.[0]
  );
}

function StockTag({ stock }: { stock?: number }) {
  if (stock === undefined || stock === null) return <Tag>Not set</Tag>;
  if (stock === 0) return <Tag color="error">Out of stock</Tag>;
  if (stock <= 5) return <Tag color="warning">Low · {stock}</Tag>;
  return <Tag color="success">In stock · {stock}</Tag>;
}

export default function ProductsTable({
  data = [],
  loading,
  fetchData,
}: Props) {
  const actions = (_: unknown, record: ProductType) => (
    <div className="management-actions">
      <Link to={`/admin/products/edit/${record.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <DeleteProduct
        productId={String(record.id)}
        productName={preferredTranslation(record)?.name}
        onDeleted={fetchData}
      />
    </div>
  );
  const columns = ProductsTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );

  return (
    <section
      className="management-surface"
      aria-label="Product list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Inventory</span>
          <h2>All products</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {data.length} {data.length === 1 ? "product" : "products"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No products yet"
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
          data.map((product) => {
            const translation = preferredTranslation(product);
            const image = product.images?.[0];
            return (
              <article className="management-mobile-card" key={product.id}>
                <div className="management-mobile-card__top">
                  {image ? (
                    <Image
                      className="management-thumb"
                      width={64}
                      height={64}
                      preview={false}
                      src={getImageSrcByBucketAndFileNames({
                        bucketName: "products",
                        fileName: image.name,
                      })}
                      alt={translation?.name || "Product"}
                    />
                  ) : (
                    <span className="management-thumb management-thumb--empty">
                      <PictureOutlined />
                    </span>
                  )}
                  <div className="management-mobile-card__identity">
                    <h3>{translation?.name || "Untitled product"}</h3>
                    <span>{translation?.slug || `ID: ${product.id}`}</span>
                  </div>
                </div>
                {translation?.description && (
                  <p className="management-mobile-card__description">
                    {translation.description}
                  </p>
                )}
                <dl className="management-mobile-card__facts">
                  <div>
                    <dt>Price</dt>
                    <dd>{product.price ?? "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Stock</dt>
                    <dd>
                      <StockTag stock={product.stock} />
                    </dd>
                  </div>
                </dl>
                {actions(null, product)}
              </article>
            );
          })
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No products yet"
          />
        )}
      </div>
    </section>
  );
}
