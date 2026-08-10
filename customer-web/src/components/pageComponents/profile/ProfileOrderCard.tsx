import { OrderType } from "@/src/utils/types/order.type";
import ProfileOrderStatusBadge from "@/src/components/pageComponents/profile/ProfileOrderStatusBadge";
import ProfileOrderItem from "@/src/components/pageComponents/profile/ProfileOrderItem";
import { useTranslations } from "next-intl";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";

export default function ProfileOrderCard({
  order,
  locale,
}: {
  order: OrderType;
  locale: string;
}) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const totalAmount = order.productAmount + order.deliveryAmount;
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6">
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">{t("orderId")}</p>
              <p
                className="font-mono text-xs font-medium text-gray-800 sm:text-sm"
                title={order?.id}
              >
                {order?.id.slice(0, 8)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                {t("orderDate")}
              </p>
              <p className="text-xs font-medium text-gray-800 sm:text-sm">
                {orderDate}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-500 sm:text-sm">
                {t("totalAmount")}
              </p>
              <p className="text-sm font-semibold text-gray-800 sm:text-sm">
                {formatCurrency(totalAmount, settings.currencyCode, locale)}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <ProfileOrderStatusBadge status={order?.status} />
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-800 sm:text-base">
          {t("orderItems")}
        </h3>
        <div className="space-y-2">
          {order?.orderItems?.map((item) => (
            <ProfileOrderItem key={item?.id} item={item} locale={locale} />
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">{t("subtotal")}</span>
            <span className="font-medium text-gray-800">
              {formatCurrency(
                order?.productAmount,
                settings.currencyCode,
                locale,
              )}
            </span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">{t("delivery")}</span>
            <span className="font-medium text-gray-800">
              {formatCurrency(
                order?.deliveryAmount,
                settings.currencyCode,
                locale,
              )}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold sm:text-base">
            <span className="text-gray-800">{t("total")}</span>
            <span className="text-gray-900">
              {formatCurrency(totalAmount, settings.currencyCode, locale)}
            </span>
          </div>
        </div>
      </div>
      {(order?.status?.toLowerCase() === "completed" ||
        order?.status?.toLowerCase() === "pending") && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {order?.status?.toLowerCase() === "completed" && (
              <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                {t("reorder")}
              </button>
            )}
            {order?.status?.toLowerCase() === "pending" && (
              <button className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                {t("cancelOrder")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
