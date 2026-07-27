import type { ColumnsType } from "antd/es/table";
import type { CompanyDetailType } from "../../../../../utils/types/companyDetailTypes.ts";
import { Image } from "antd";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

export default [
  {
    title: "Key",
    dataIndex: ["key"],
    key: "key",
  },
  {
    title: "Value",
    dataIndex: ["value"],
    key: "value",
  },
  {
    title: "Image",
    dataIndex: ["image"],
    key: "image",
    render: (image: string) => (
      <Image
        src={getImageSrcByBucketAndFileNames({
          bucketName: "commercor",
          fileName: image,
        })}
        width={150}
        height={150}
        alt="Brand Image"
      />
    ),
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<CompanyDetailType>;
