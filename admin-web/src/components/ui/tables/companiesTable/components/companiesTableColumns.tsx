import { FileImageOutlined } from "@ant-design/icons";
import { Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CompanyDetailType } from "../../../../../utils/types/companyDetailTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

export function companyLabel(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default [
  {
    title: "Detail",
    dataIndex: "key",
    key: "key",
    width: 280,
    render: (key: string) => (
      <div className="management-company-key">
        <span className="management-detail-icon">
          <FileImageOutlined />
        </span>
        <div>
          <strong>{companyLabel(key)}</strong>
          <span>{key}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    render: (value?: string) => (
      <span className="management-description">{value || "No text value"}</span>
    ),
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    width: 120,
    render: (image: string | undefined, record) =>
      image ? (
        <Image
          className="management-thumb"
          width={56}
          height={56}
          preview={false}
          src={getImageSrcByBucketAndFileNames({
            bucketName: "commercor",
            fileName: image,
          })}
          alt={`${companyLabel(record.key)} company detail`}
        />
      ) : (
        <span className="management-description">No image</span>
      ),
  },
  { title: "Actions", key: "actions", width: 180, fixed: "right" },
] as ColumnsType<CompanyDetailType>;
