export type PaymentType = {
  id: string;
  // decimal columns - TypeORM/pg returns these as strings at runtime, see
  // src/utils/functions/money.ts
  totalAmount: number | string;
  refundedAmount: number | string;
  status: string;
  paidAmount: number | string | null;
  currencyCode: string | null;
  provider: string | null;
  providerPaymentId: string | null;
  externalTransactionId: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  cancellationReason: string | null;
  createdAt?: string;
  updatedAt?: string;
};
