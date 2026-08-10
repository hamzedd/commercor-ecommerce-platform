import { PictureOutlined } from "@ant-design/icons";
import { Image, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  ProductTranslationType,
  ProductType,
} from "../../../../../utils/types/productTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

function translationOf(translations?: ProductTranslationType[]) {
  return (
    translations?.find((item) => item.lang?.toLowerCase() === "en") ??
    translations?.[0]
  );
}

export default [
  {
    title: "Product",
    key: "product",
    width: 330,
    render: (_, product) => {
      const translation = translationOf(product.translations);
      const image = product.images?.[0];
      return (
        <div className="management-table-identity">
          {image ? (
            <Image
              className="management-thumb"
              width={56}
              height={56}
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
          <div>
            <strong>{translation?.name || "Untitled product"}</strong>
            <span>{translation?.slug || `ID: ${product.id}`}</span>
            {product.images?.length > 1 && (
              <small>{product.images.length} images</small>
            )}
          </div>
        </div>
      );
    },
  },
  {
    title: "Description",
    key: "description",
    ellipsis: true,
    render: (_, product) => (
      <span className="management-description">
        {translationOf(product.translations)?.description || "No description"}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    width: 120,
    render: (price?: string) => (
      <strong className="management-price">{price ?? "—"}</strong>
    ),
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    width: 145,
    render: (stock?: number) =>
      stock === undefined || stock === null ? (
        <Tag>Not set</Tag>
      ) : stock === 0 ? (
        <Tag color="error">Out of stock</Tag>
      ) : stock <= 5 ? (
        <Tag color="warning">Low · {stock}</Tag>
      ) : (
        <Tag color="success">In stock · {stock}</Tag>
      ),
  },
  { title: "Actions", key: "actions", width: 180, fixed: "right" },
] as ColumnsType<ProductType>;
