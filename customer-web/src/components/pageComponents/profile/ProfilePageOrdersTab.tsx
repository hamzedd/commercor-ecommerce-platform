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
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm motion-reduce:animate-none"
        >
          <div className="mb-4 h-6 w-1/4 rounded bg-slate-200"></div>
          <div className="mb-2 h-4 w-1/2 rounded bg-slate-200"></div>
          <div className="h-4 w-1/3 rounded bg-slate-100"></div>
        </div>
      ))}
    </div>
  );
};

function EmptyState() {
  const t = useTranslations();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-12">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-violet-900/20 sm:h-24 sm:w-24">
          <svg
            className="h-10 w-10 sm:h-12 sm:w-12"
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
        <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
          {t("noOrdersYet")}
        </h3>
        <p className="mb-6 text-sm text-slate-600 sm:text-base">
          {t("noOrdersDescription")}
        </p>
        <Link
          href={"/"}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-6 font-bold text-white shadow-md shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-800/30 sm:w-auto"
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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
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
