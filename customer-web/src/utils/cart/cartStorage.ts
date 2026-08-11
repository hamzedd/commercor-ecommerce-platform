import { CreateOrderItemType } from "@/src/utils/types/order.type";

export const CART_UPDATED_EVENT = "commercor-cart-updated";

export function getCart(): CreateOrderItemType[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem("cart") || "[]",
    ) as CreateOrderItemType[];
  } catch {
    return [];
  }
}

export function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

export function getCartItemsCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}