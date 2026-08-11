import { PictureOutlined, TrophyOutlined } from "@ant-design/icons";
import { Card, Empty, Image } from "antd";
import { Link } from "react-router";
import type { TopSellingProductType } from "../../../utils/types/dashboardTypes.ts";
import getImageSrcByBucketAndFileNames from "../../../utils/functions/getImageSrcByBucketAndFileNames.ts";

const formatAmount = (value: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function TopSellingProducts({ products }: { products: TopSellingProductType[] }) {
  return (
    <Card
      bordered={false}
      className="h-full border border-stone-200 shadow-sm"
      title={
        <div className="flex items-center gap-3 py-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <TrophyOutlined />
          </span>
          <div>
            <div className="text-base font-bold text-stone-900">
              Top Selling Products
            </div>
            <div className="text-xs font-normal text-stone-500">
              Ranked by units sold
            </div>
          </div>
        </div>
      }
    >
      {products.length === 0 ? (
        <Empty
          className="py-14"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No product sales yet"
        />
      ) : (
        <div className="divide-y divide-stone-100">
          {products.map((product, index) => (
            <Link
              key={product.productId}
              to={"/admin/products/edit/" + product.productId}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="w-5 shrink-0 text-center text-sm font-bold text-amber-700">
                {index + 1}
              </span>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100 text-stone-400">
                {product.image ? (
                  <Image
                    preview={false}
                    width={48}
                    height={48}
                    className="object-cover"
                    src={getImageSrcByBucketAndFileNames({
                      bucketName: "products",
                      fileName: product.image,
                    })}
                  />
                ) : (
                  <PictureOutlined />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-stone-900">
                  {product.name}
                </div>
                <div className="text-xs text-stone-500">
                  {product.quantitySold.toLocaleString()} sold
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-bold text-stone-900">
                  {formatAmount(product.revenue)}
                </div>
                <div className="text-xs text-stone-400">revenue</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

export default TopSellingProducts;
