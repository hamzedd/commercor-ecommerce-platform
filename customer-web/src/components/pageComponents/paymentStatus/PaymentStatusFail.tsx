import React from "react";
import { useTranslations } from "next-intl";

function PaymentStatusFail() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-12 w-12 text-red-500"
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
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          {t("paymentFailed")}
        </h2>
        <p className="mb-4 text-gray-600">{t("paymentCouldNotBeProcessed")}</p>
        <div className="flex gap-3">
          <button className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-300">
            {t("goBack")}
          </button>
          <button className="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600">
            {t("tryAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatusFail;
