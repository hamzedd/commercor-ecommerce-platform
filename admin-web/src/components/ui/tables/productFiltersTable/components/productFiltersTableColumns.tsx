import { FilterOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  ProductFilterTranslationType,
  ProductFilterType,
} from "../../../../../utils/types/productFilterTypes.ts";
import type { CategoryType } from "../../../../../utils/types/categoryTypes.ts";

export function filterTranslation(
  filter: ProductFilterType,
): ProductFilterTranslationType | undefined {
  return (
    filter.translations?.find((item) => item.lang?.toLowerCase() === "en") ??
    filter.translations?.[0]
  );
}

export function categoryName(category: CategoryType) {
  return (
    category.translations?.find(
      (translation) => translation.lang?.toLowerCase() === "en",
    )?.name ||
    category.translations?.[0]?.name ||
    category.id
  );
}

export default [
  {
    title: "Filter",
    key: "filter",
    render: (_, filter) => {
      const translation = filterTranslation(filter);
      return (
        <div className="management-company-key">
          <span className="management-detail-icon">
            <FilterOutlined />
          </span>
          <div>
            <strong>{translation?.name || "Untitled filter"}</strong>
            <span>{translation?.slug || `ID: ${filter.id}`}</span>
          </div>
        </div>
      );
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 180,
    render: (type?: string) =>
      type ? <Tag color="gold">{type}</Tag> : <Tag>Not set</Tag>,
  },
  {
    title: "Categories",
    dataIndex: "categories",
    key: "categories",
    width: 260,
    render: (categories?: CategoryType[]) => (
      <div className="management-tag-list">
        {categories?.length ? (
          categories
            .slice(0, 2)
            .map((category) => (
              <Tag key={category.id}>{categoryName(category)}</Tag>
            ))
        ) : (
          <span className="management-description">Unassigned</span>
        )}
        {categories && categories.length > 2 && (
          <Tag>+{categories.length - 2}</Tag>
        )}
      </div>
    ),
  },
  {
    title: "Languages",
    dataIndex: "translations",
    key: "languages",
    width: 210,
    render: (translations: ProductFilterTranslationType[]) => (
      <div className="management-tag-list">
        {translations?.length ? (
          translations.map((translation) => (
            <Tag key={translation.id}>{translation.lang}</Tag>
          ))
        ) : (
          <span className="management-description">No translations</span>
        )}
      </div>
    ),
  },
  { title: "Actions", key: "actions", width: 180, fixed: "right" },
] as ColumnsType<ProductFilterType>;
