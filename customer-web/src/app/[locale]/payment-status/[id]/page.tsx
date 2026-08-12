"use client";
import React from "react";
import PaymentStatusLoading from "@/src/components/pageComponents/paymentStatus/PaymentStatusLoading";
import PaymentStatusSuccess from "@/src/components/pageComponents/paymentStatus/PaymentStatusSuccess";
import PaymentStatusFail from "@/src/components/pageComponents/paymentStatus/PaymentStatusFail";
import { usePaymentStatusQuery } from "@/src/service/react-query/payments/query/usePaymentStatusQuery";
import { useParams } from "next/navigation";

function PaymentStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = usePaymentStatusQuery({ id });

  if (isLoading || data?.status === "pending") {
    return <PaymentStatusLoading />;
  }

  if (data?.status === "completed") {
    return <PaymentStatusSuccess />;
  }

  if (isError || data?.status === "failed" || data?.status === "cancelled") return <PaymentStatusFail />;

  return <PaymentStatusLoading />;
}

export default PaymentStatusPage;
