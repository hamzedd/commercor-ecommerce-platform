"use client";

import { Link } from "@/src/i18n/navigation";
import React from "react";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useTranslations } from "next-intl";

function PaymentStatusManualPending() {
  const t = useTranslations();
  const { data: user } = useCurrentUserQuery();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="store-card-enter w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-emerald-950/5">
        <div className="store-pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-900/20">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-950">
          {t("manualPaymentConfirmedTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("manualPaymentConfirmedMessage")}
        </p>
        <Link
          href={user?.id ? "/profile" : "/"}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-6 font-bold text-white shadow-md shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {t("continue")}
        </Link>
      </div>
    </div>
  );
}

export default PaymentStatusManualPending;
