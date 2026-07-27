export type PaymentType = {
  id: string;
  totalAmount: number;
  refundedAmount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};
