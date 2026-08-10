import type { AddressType } from "./addressTypes.ts";
import type { CustomerType } from "./customerTypes.ts";
import type { ProductType } from "./productTypes.ts";
import type { PaymentType } from "./paymentTypes.ts";

export type OrderItemType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  orderId: string;
  product: ProductType;
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type OrderType = {
  id: string | number;
  status?: string;
  deliveryAmount: number;
  productAmount: number;
  address: AddressType;
  customer: CustomerType;
  orderItems: OrderItemType[];
  payment: PaymentType;
  created_at?: string;
};
