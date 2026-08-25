import React from "react";
import { useTranslations } from "next-intl";

function PaymentStatusFail({ expired = false }: { expired?: boolean }) {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="store-card-enter w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-red-950/5">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md shadow-red-900/20">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-950">
          {expired ? t("paymentExpired") : t("paymentFailed")}
        </h2>
        <p className="mb-6 text-slate-600">
          {expired
            ? t("paymentExpiredMessage")
            : t("paymentCouldNotBeProcessed")}
        </p>
        <div className="flex gap-3">
          <button className="min-h-12 flex-1 rounded-xl border border-slate-300 font-bold text-slate-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none">
            {t("goBack")}
          </button>
          <button className="min-h-12 flex-1 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 font-bold text-white shadow-md shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none">
            {t("tryAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatusFail;
