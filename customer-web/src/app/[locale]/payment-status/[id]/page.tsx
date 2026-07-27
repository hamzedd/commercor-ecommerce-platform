"use client";
import React from "react";
import PaymentStatusLoading from "@/src/components/pageComponents/paymentStatus/PaymentStatusLoading";
import PaymentStatusSuccess from "@/src/components/pageComponents/paymentStatus/PaymentStatusSuccess";
import PaymentStatusFail from "@/src/components/pageComponents/paymentStatus/PaymentStatusFail";
import { usePaymentStatusQuery } from "@/src/service/react-query/payments/query/usePaymentStatusQuery";
import { useParams } from "next/navigation";

function PaymentStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePaymentStatusQuery({ id });

  if (isLoading) {
    return <PaymentStatusLoading />;
  }

  if (data?.status === "completed") {
    return <PaymentStatusSuccess />;
  }

  return <PaymentStatusFail />;
}

export default PaymentStatusPage;
