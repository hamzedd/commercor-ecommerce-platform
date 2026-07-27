import React from "react";
import { useTranslations } from "next-intl";

function PaymentStatusLoading() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-500"></div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          {t("processingPayment")}
        </h2>
        <p className="text-gray-600">{t("pleaseWaitVerifyPayment")}</p>
      </div>
    </div>
  );
}

export default PaymentStatusLoading;
