import { useTranslations } from "next-intl";

export default function ProfileOrderStatusBadge({
  status,
}: {
  status: string;
}) {
  const t = useTranslations();

  const statusConfig: Record<
    string,
    { bg: string; text: string; labelKey: string }
  > = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      labelKey: "statusPending",
    },
    processing: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      labelKey: "statusProcessing",
    },
    shipped: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      labelKey: "statusShipped",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      labelKey: "statusDelivered",
    },
    delivered: { bg:"bg-green-100",text:"text-green-800",labelKey:"statusDelivered" },
    refunded: { bg:"bg-stone-200",text:"text-stone-800",labelKey:"refunded" },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      labelKey: "statusCancelled",
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${config.bg} ${config.text}`}
    >
      {t(config.labelKey)}
    </span>
  );
}
