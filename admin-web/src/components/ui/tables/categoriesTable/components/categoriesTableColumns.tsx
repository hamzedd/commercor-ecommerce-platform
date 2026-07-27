import type { ColumnsType } from "antd/es/table";
import type {
  CategoryTranslationType,
  CategoryType,
} from "../../../../../utils/types/categoryTypes.ts";
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
      const first = Object.values(translations)[0] as CategoryTranslationType;
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
          bucketName: "categories",
          fileName: image,
        })}
        width={150}
        height={150}
        alt="Category Image"
      />
    ),
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (id: any) => id || "-",
  },
  {
    title: "Parent ID",
    dataIndex: "parentId",
    key: "parentId",
    render: (parentId: any) => parentId || "-",
  },
  {
    title: "Description",
    dataIndex: ["translations"],
    key: "description",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.description)
        return translations.EN.description;
      const first = Object.values(translations)[0] as CategoryTranslationType;
      return (first && first.description) || "-";
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
      const first = Object.values(translations)[0] as CategoryTranslationType;
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
      const first = Object.values(translations)[0] as CategoryTranslationType;
      return (first && first.slug) || "-";
    },
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<CategoryType>;
