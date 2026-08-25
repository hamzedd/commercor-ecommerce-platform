import React from "react";
import { useTranslations } from "next-intl";

function PaymentStatusLoading() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="store-card-enter w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-950">
          {t("processingPayment")}
        </h2>
        <p className="text-slate-600">{t("pleaseWaitVerifyPayment")}</p>
      </div>
    </div>
  );
}

export default PaymentStatusLoading;
