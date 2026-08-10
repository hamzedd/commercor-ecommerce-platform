import { OrderType } from "@/src/utils/types/order.type";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { useTranslations } from "next-intl";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";

export default function ProfileOrderItem({
  item,
  locale,
}: {
  item: OrderType["orderItems"][0];
  locale: string;
}) {
  const t = useTranslations();
  const settings = useStoreSettings();

  // Find translation for the current locale, fallback to first translation
  const productTranslation =
    item?.product?.translations.find(
      (t) => t.lang.toLowerCase() === locale.toLowerCase(),
    ) || item?.product?.translations[0];
  const productImage = item?.product?.images?.[0]?.name || "/placeholder.png";

  return (
    <Link
      href={{
        pathname: "/products/[slug]",
        params: { slug: productTranslation?.slug },
      }}
      className="flex items-start gap-3 border-b py-3 last:border-b-0 sm:items-center sm:gap-4"
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={getImageSrcByBucketAndFileNames({
            fileName: productImage,
            bucketName: "products",
          })}
          width={48}
          height={48}
          alt={productTranslation?.name}
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-gray-800 sm:text-base">
          {productTranslation?.name}
        </h4>
        <p className="text-xs text-gray-500 sm:text-sm">
          {t("quantity")}: {item?.quantity}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold text-gray-800 sm:text-base">
          {formatCurrency(item?.unitPrice || 0, settings.currencyCode, locale)}
        </p>
        <p className="text-xs text-gray-500 sm:text-sm">{t("perItem")}</p>
      </div>
    </Link>
  );
}
