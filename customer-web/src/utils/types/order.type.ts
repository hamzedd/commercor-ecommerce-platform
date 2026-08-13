import { ProductType } from "@/src/utils/types/product.type";

export type CreateOrderRequestType = {
  items: CreateOrderItemType[];
  addressId: string;
  usePoints?: number;
  useCashback?: number;
  couponCode?: string;
};

export type CreateOrderItemType = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export type CheckoutQuoteType = {
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  currencyCode: string;
  pricesIncludeTax: boolean;
  pointsRedeemed: number;
  pointsDiscount: number;
  cashbackUsed: number;
  discountedSubtotal: number;
  couponCode: string | null;
  couponDiscount: number;
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
  fulfillmentStatus:string;carrier:string|null;trackingNumber:string|null;trackingUrl:string|null;processingAt:string|null;shippedAt:string|null;deliveredAt:string|null;cancelledAt:string|null;statusHistory:{id:string;fromStatus:string|null;toStatus:string;note:string|null;createdAt:string}[];
  orderItems: OrderItemType[];
  invoice?: { id: string; invoiceNumber: string; issuedAt: string } | null;
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
  variantId: string | null;
  variantSku: string | null;
  variantDescription: string | null;
};
