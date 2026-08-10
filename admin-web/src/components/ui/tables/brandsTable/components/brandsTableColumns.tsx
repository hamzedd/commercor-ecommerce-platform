import { PictureOutlined } from "@ant-design/icons";
import { Image, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  BrandTranslationType,
  BrandType,
} from "../../../../../utils/types/brandTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

export function brandTranslation(
  brand: BrandType,
): BrandTranslationType | undefined {
  return (
    brand.translations?.find((item) => item.lang?.toLowerCase() === "en") ??
    brand.translations?.[0]
  );
}

export function brandImage(brand: BrandType) {
  return brand.image || brand.imagepath;
}

export default [
  {
    title: "Brand",
    key: "brand",
    width: 340,
    render: (_, brand) => {
      const translation = brandTranslation(brand);
      const image = brandImage(brand);
      return (
        <div className="management-table-identity">
          {image ? (
            <Image
              className="management-thumb"
              width={56}
              height={56}
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
          <div>
            <strong>{translation?.name || "Untitled brand"}</strong>
            <span>{translation?.slug || `ID: ${brand.id}`}</span>
            {brand.translations && (
              <small>
                {brand.translations.length}{" "}
                {brand.translations.length === 1
                  ? "translation"
                  : "translations"}
              </small>
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
    render: (_, brand) => (
      <span className="management-description">
        {brandTranslation(brand)?.description || "No description"}
      </span>
    ),
  },
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    width: 110,
    render: (rank?: number) =>
      rank === undefined || rank === null ? (
        <Tag>Not set</Tag>
      ) : (
        <Tag color="gold">{rank}</Tag>
      ),
  },
  { title: "Actions", key: "actions", width: 180, fixed: "right" },
] as ColumnsType<BrandType>;
