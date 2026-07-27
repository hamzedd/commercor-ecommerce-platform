import type { ColumnsType } from "antd/es/table";
import type {
  ProductImageType,
  ProductTranslationType,
  ProductType,
} from "../../../../../utils/types/productTypes.ts";
import { Carousel, Image } from "antd";
import getImageSrcByBucketAndFileNames from "../../../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

export default [
  {
    title: "Name",
    dataIndex: ["translations"],
    key: "name",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.name) return translations.EN.name;
      const first = Object.values(translations)[0] as ProductTranslationType;
      return (first && first.name) || "-";
    },
  },
  {
    title: "Images",
    dataIndex: "images",
    key: "images",
    width: 150,
    render: (images: ProductImageType[]) =>
      !!images.length && (
        <Carousel className={"w-[150px]"} dots autoplay autoplaySpeed={3000}>
          {images?.map((img) => (
            <Image
              key={img.id}
              width={150}
              className={"object-contain"}
              height={150}
              src={getImageSrcByBucketAndFileNames({
                bucketName: "products",
                fileName: img.name,
              })}
            ></Image>
          ))}
        </Carousel>
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
      const first = Object.values(translations)[0] as ProductTranslationType;
      return (first && first.description) || "-";
    },
  },
  {
    title: "Slug",
    dataIndex: ["translations"],
    key: "slug",
    render: (translations) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.slug) return translations.EN.slug;
      const first = Object.values(translations)[0] as ProductTranslationType;
      return (first && first.slug) || "-";
    },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (price: any) => price ?? "-",
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    render: (stock: any) => stock ?? "-",
  },
  {
    title: "MetaDescription",
    dataIndex: ["translations"],
    key: "metaDescription",
    render: (translations: any) => {
      if (!translations) return "-";
      if (translations.EN && translations.EN.metaDescription)
        return translations.EN.metaDescription;
      const first = Object.values(translations)[0] as any;
      return (first && first.metaDescription) || "-";
    },
  },
  {
    title: "Actions",
    key: "actions",
  },
] as ColumnsType<ProductType>;
