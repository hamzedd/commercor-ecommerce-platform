"use client";
import React, { useEffect } from "react";
import PaymentStatusLoading from "@/src/components/pageComponents/paymentStatus/PaymentStatusLoading";
import PaymentStatusSuccess from "@/src/components/pageComponents/paymentStatus/PaymentStatusSuccess";
import PaymentStatusManualPending from "@/src/components/pageComponents/paymentStatus/PaymentStatusManualPending";
import PaymentStatusFail from "@/src/components/pageComponents/paymentStatus/PaymentStatusFail";
import { usePaymentStatusQuery } from "@/src/service/react-query/payments/query/usePaymentStatusQuery";
import { useParams } from "next/navigation";
import { refreshCartFromServer } from "@/src/utils/cart/cartStorage";

function PaymentStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = usePaymentStatusQuery({ id });

  const isConfirmedOrder =
    data?.status === "completed" ||
    (data?.status === "pending" && data?.provider === "manual");

  useEffect(() => {
    if (isConfirmedOrder) {
      // A confirmed order (paid or cash-on-delivery) means the backend has
      // already converted the cart and released its checkout lock. Re-sync
      // the client-side cart cache from the server so the badge/cart page
      // reflect that instead of showing stale, already-ordered items.
      refreshCartFromServer().catch(() => undefined);
    }
  }, [isConfirmedOrder]);

  if (data?.status === "pending" && data?.provider === "manual") {
    return <PaymentStatusManualPending />;
  }

  if (isLoading || data?.status === "pending") {
    return <PaymentStatusLoading />;
  }

  if (data?.status === "completed") {
    return <PaymentStatusSuccess />;
  }

  if (isError || data?.status === "failed" || data?.status === "cancelled") {
    return (
      <PaymentStatusFail
        expired={data?.cancellationReason === "pending_payment_expired"}
      />
    );
  }

  return <PaymentStatusLoading />;
}

export default PaymentStatusPage;
