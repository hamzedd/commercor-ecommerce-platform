import { Link } from "@/src/i18n/navigation";
import React from "react";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useTranslations } from "next-intl";

function PaymentStatusSuccess() {
  const t = useTranslations();
  const { data: user } = useCurrentUserQuery();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-12 w-12 text-green-500"
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
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          {t("paymentSuccessful")}
        </h2>
        <p className="mb-4 text-gray-600">
          {t("paymentProcessedSuccessfully")}
        </p>
        <Link
          href={user?.id ? "/profile" : "/"}
          className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
        >
          {t("continue")}
        </Link>
      </div>
    </div>
  );
}

export default PaymentStatusSuccess;
