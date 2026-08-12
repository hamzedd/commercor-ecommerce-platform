import { ProductType } from "@/src/utils/types/product.type";

export type CreateOrderRequestType = {
  items: CreateOrderItemType[];
  addressId: string;
};

export type CreateOrderItemType = {
  productId: string;
  quantity: number;
};

export type CheckoutQuoteType = {
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  currencyCode: string;
  pricesIncludeTax: boolean;
};

export type OrderType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  customerId: string;
  paymentId: string;
  addressId: string;
  productAmount: number;
  deliveryAmount: number;
  taxAmount: number;
  finalTotal: number;
  status: string;
  orderItems: OrderItemType[];
};

export type OrderItemType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  orderId: string;
  product: ProductType;
  productId: "4c0ac378-e547-4b7d-8f82-1f67c4d6a26d";
  quantity: number;
  unitPrice: number;
};
