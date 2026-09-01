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
  // decimal column - TypeORM/pg returns this as a string at runtime, see
  // src/utils/functions/money.ts
  unitPrice: number | string;
  variantId: string | null;
  variantSku: string | null;
  variantDescription: string | null;
};

export type OrderType = {
  id: string | number;
  // decimal columns - TypeORM/pg returns these as strings at runtime, see
  // src/utils/functions/money.ts
  deliveryAmount: number | string;
  productAmount: number | string;
  taxAmount: number | string;
  finalTotal: number | string;
  address: AddressType;
  customer: CustomerType;
  orderItems: OrderItemType[];
  payment: PaymentType;
  created_at?: string;
  fulfillmentStatus:string;carrier:string|null;trackingNumber:string|null;trackingUrl:string|null;processingAt:string|null;shippedAt:string|null;deliveredAt:string|null;cancelledAt:string|null;validNextFulfillmentStatuses:string[];statusHistory:{id:string;fromStatus:string|null;toStatus:string;note:string|null;created_at:string}[];
};
