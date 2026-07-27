import type { ColumnsType } from "antd/es/table";
import type {
  BrandTranslationType,
  BrandType,
} from "../../../../../utils/types/brandTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";
import { Image } from "antd";

export default [
  {
    title: "Name",
    dataIndex: ["translations"],
    key: "name",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.name) return translations.EN.name;
      const first = Object.values(translations)[0] as BrandTranslationType;
      return (first && first.name) || "-";
    },
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image: string) => (
      <Image
        src={getImageSrcByBucketAndFileNames({
          bucketName: "brands",
          fileName: image,
        })}
        width={150}
        height={150}
        alt="Brand Image"
      />
    ),
  },
  {
    title: "Description",
    dataIndex: ["translations"],
    key: "description",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.description)
        return translations.EN.description;
      const first = Object.values(translations)[0] as BrandTranslationType;
      return (first && first.description) || "-";
    },
  },
  {
    title: "Meta Title",
    dataIndex: ["translations"],
    key: "metaTitle",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.metaTitle)
        return translations.EN.metaTitle;
      const first = Object.values(translations)[0] as BrandTranslationType;
      return (first && first.metaTitle) || "-";
    },
  },
  {
    title: "Meta Description",
    dataIndex: ["translations"],
    key: "metaDescription",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.metaDescription)
        return translations.EN.metaDescription;
      const first = Object.values(translations)[0] as BrandTranslationType;
      return (first && first.metaDescription) || "-";
    },
  },
  {
    title: "Slug",
    dataIndex: ["translations"],
    key: "slug",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.slug) return translations.EN.slug;
      const first = Object.values(translations)[0] as BrandTranslationType;
      return (first && first.slug) || "-";
    },
  },
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (rank: any) =>
      rank === null || rank === undefined ? "-" : String(rank),
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<BrandType>;
