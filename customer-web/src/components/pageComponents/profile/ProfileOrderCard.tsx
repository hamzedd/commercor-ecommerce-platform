import { OrderType } from "@/src/utils/types/order.type";
import ProfileOrderStatusBadge from "@/src/components/pageComponents/profile/ProfileOrderStatusBadge";
import ProfileOrderItem from "@/src/components/pageComponents/profile/ProfileOrderItem";
import { useTranslations } from "next-intl";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import { downloadInvoiceService } from "@/src/service/apiServices/order.service";

export default function ProfileOrderCard({
  order,
  locale,
}: {
  order: OrderType;
  locale: string;
}) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const totalAmount =
    order.finalTotal ??
    order.productAmount + order.deliveryAmount + (order.taxAmount || 0);
  const orderDate = new Date(order.created_at).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const downloadInvoice = async () => {
    if (!order.invoice) return;
    const blob = await downloadInvoiceService(order.invoice.id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${order.invoice.invoiceNumber}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-violet-950/5">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6">
            <div>
              <p className="text-xs text-slate-500 sm:text-sm">
                {t("orderId")}
              </p>
              <p
                className="font-mono text-xs font-medium text-slate-800 sm:text-sm"
                title={order?.id}
              >
                {order?.id.slice(0, 8)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 sm:text-sm">
                {t("orderDate")}
              </p>
              <p className="text-xs font-medium text-slate-800 sm:text-sm">
                {orderDate}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-500 sm:text-sm">
                {t("totalAmount")}
              </p>
              <p className="text-sm font-semibold text-slate-800 sm:text-sm">
                {formatCurrency(totalAmount, settings.currencyCode, locale)}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <ProfileOrderStatusBadge
              status={order?.fulfillmentStatus || order?.status}
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="mb-5 rounded-xl bg-gradient-to-br from-violet-50 via-slate-50 to-blue-50 p-4">
          <h3 className="font-bold text-slate-950">{t("orderTracking")}</h3>
          {["pending", "processing", "shipped", "delivered"].map(
            (status, index) => {
              const current = order.fulfillmentStatus || "pending",
                states = ["pending", "processing", "shipped", "delivered"],
                active =
                  states.indexOf(current) >= index &&
                  !["cancelled", "refunded"].includes(current);
              const time =
                status === "processing"
                  ? order.processingAt
                  : status === "shipped"
                    ? order.shippedAt
                    : status === "delivered"
                      ? order.deliveredAt
                      : order.created_at;
              return (
                <div key={status} className="mt-3 flex gap-3">
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${active ? "bg-gradient-to-br from-blue-500 to-violet-600" : "bg-slate-300"}`}
                  />
                  <div>
                    <b className="text-slate-950">
                      {t(status === "pending" ? "orderConfirmed" : status)}
                    </b>
                    {time && (
                      <p className="text-xs text-slate-500">
                        {new Date(time).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            },
          )}
          {["cancelled", "refunded"].includes(order.fulfillmentStatus) && (
            <p className="mt-3 font-bold text-red-700">
              {t(order.fulfillmentStatus)}
            </p>
          )}
          {order.trackingNumber && (
            <div className="mt-4 text-sm">
              <p>
                {t("carrier")}: {order.carrier || "-"}
              </p>
              <p>
                {t("trackingNumber")}: {order.trackingNumber}
              </p>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-bold text-violet-700"
                >
                  {t("trackPackage")}
                </a>
              )}
            </div>
          )}
          {order.statusHistory
            ?.filter((h) => h.note)
            .map((h) => (
              <p key={h.id} className="mt-2 text-sm text-slate-600">
                {h.note}
              </p>
            ))}
        </div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800 sm:text-base">
          {t("orderItems")}
        </h3>
        <div className="space-y-2">
          {order?.orderItems?.map((item) => (
            <ProfileOrderItem key={item?.id} item={item} locale={locale} />
          ))}
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-slate-600">{t("subtotal")}</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(
                order?.productAmount,
                settings.currencyCode,
                locale,
              )}
            </span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-slate-600">{t("delivery")}</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(
                order?.deliveryAmount,
                settings.currencyCode,
                locale,
              )}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-semibold sm:text-base">
            <span className="text-slate-800">{t("total")}</span>
            <span className="text-slate-950">
              {formatCurrency(totalAmount, settings.currencyCode, locale)}
            </span>
          </div>
        </div>
      </div>
      {order.invoice && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <p className="mb-2 text-sm font-semibold text-slate-950">
            {t("invoice")}: {order.invoice.invoiceNumber}
          </p>
          <button
            onClick={downloadInvoice}
            className="rounded-xl border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-700 transition-colors duration-200 hover:border-violet-400 hover:bg-violet-50"
          >
            {t("downloadPdf")}
          </button>
        </div>
      )}
      {(order?.status?.toLowerCase() === "completed" ||
        order?.status?.toLowerCase() === "pending") && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {order?.status?.toLowerCase() === "completed" && (
              <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-violet-900/20 transition-all duration-200 hover:shadow-md hover:shadow-violet-800/30">
                {t("reorder")}
              </button>
            )}
            {order?.status?.toLowerCase() === "pending" && (
              <button className="w-full rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50">
                {t("cancelOrder")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
