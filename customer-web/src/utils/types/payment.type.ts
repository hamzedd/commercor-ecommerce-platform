export type GetPaymentStatusResponseType = {
  status: string;
  orderStatus: string;
  expectedAmount: number;
  paidAmount: number | null;
  currencyCode: string | null;
  refundedAmount: number;
  provider: string | null;
  expiresAt: string | null;
  cancellationReason: string | null;
};
