import type { ColumnsType } from "antd/es/table";
import type {
  ProductFilterTranslationType,
  ProductFilterType,
} from "../../../../../utils/types/productFilterTypes.ts";

export default [
  {
    title: "Name",
    dataIndex: ["translations"],
    key: "name",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.name) return translations.EN.name;
      const first = Object.values(translations)[0] as ProductFilterTranslationType;
      return (first && first.name) || "-";
    },
  },
  {
    title: "Product Filter Id",
    dataIndex: ["translations"],
    key: "productFilterId",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.productFilterId)
        return translations.EN.productFilterId;
      const first = Object.values(translations)[0] as ProductFilterTranslationType;
      return (first && first.productFilterId) || "-";
    },
    },
    {
    title: "Lang",
    dataIndex: ["translations"],
    key: "lang",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.lang)
        return translations.EN.lang;
      const first = Object.values(translations)[0] as ProductFilterTranslationType;
      return (first && first.lang) || "-";
    },
    },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<ProductFilterType>;
