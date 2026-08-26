"use client";
import { useOrdersQuery } from "@/src/service/react-query/orders/query/useOrdersQuery";
import { OrderType } from "@/src/utils/types/order.type";
import { useParams } from "next/navigation";
import ProfileOrderCard from "@/src/components/pageComponents/profile/ProfileOrderCard";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

const LoadingState = () => {
  return (
    <div className="flex flex-col gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-md"
        >
          <div className="mb-4 h-6 w-1/4 rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
};

function EmptyState() {
  const t = useTranslations();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md sm:p-12">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 sm:h-24 sm:w-24">
          <svg
            className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800 sm:text-xl">
          {t("noOrdersYet")}
        </h3>
        <p className="mb-6 text-sm text-gray-600 sm:text-base">
          {t("noOrdersDescription")}
        </p>
        <Link
          href={"/"}
          className="w-full rounded-lg bg-[var(--store-accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          {t("startShopping")}
        </Link>
      </div>
    </div>
  );
}

function ProfilePageOrdersTab() {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const { data, isLoading, isError } = useOrdersQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">{t("failedToLoadOrders")}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-5">
      {data.map((order: OrderType) => (
        <ProfileOrderCard key={order.id} order={order} locale={locale} />
      ))}
    </div>
  );
}

export default ProfilePageOrdersTab;
