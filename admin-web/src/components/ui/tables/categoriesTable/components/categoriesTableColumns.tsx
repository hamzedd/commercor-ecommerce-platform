import { PictureOutlined } from "@ant-design/icons";
import { Image, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  CategoryTranslationType,
  CategoryType,
} from "../../../../../utils/types/categoryTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

function translationOf(translations?: CategoryTranslationType[]) {
  return (
    translations?.find((item) => item.lang?.toLowerCase() === "en") ??
    translations?.[0]
  );
}

export default [
  {
    title: "Category",
    key: "category",
    width: 320,
    render: (_, category) => {
      const translation = translationOf(category.translations);
      return (
        <div className="management-table-identity">
          {category.image ? (
            <Image
              className="management-thumb"
              width={56}
              height={56}
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
          <div>
            <strong>{translation?.name || "Untitled category"}</strong>
            <span>{translation?.slug || `ID: ${category.id}`}</span>
          </div>
        </div>
      );
    },
  },
  {
    title: "Description",
    key: "description",
    ellipsis: true,
    render: (_, category) => (
      <span className="management-description">
        {translationOf(category.translations)?.description || "No description"}
      </span>
    ),
  },
  {
    title: "Hierarchy",
    key: "parentId",
    width: 150,
    render: (_, category) => (
      <Tag>{category.parentId ? "Child category" : "Top level"}</Tag>
    ),
  },
  { title: "Actions", key: "actions", width: 180, fixed: "right" },
] as ColumnsType<CategoryType>;
