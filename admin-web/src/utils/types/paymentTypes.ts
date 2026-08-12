export type PaymentType = {
  id: string;
  totalAmount: number;
  refundedAmount: number;
  status: string;
  paidAmount: number | null;
  currencyCode: string | null;
  provider: string | null;
  externalTransactionId: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  cancellationReason: string | null;
  createdAt?: string;
  updatedAt?: string;
};
