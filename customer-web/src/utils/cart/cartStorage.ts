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

export async function syncGuestCartToServer() {
  if (typeof window === 'undefined') return null;
  const token=localStorage.getItem('accessToken'); if(!token)return null;
  const { addServerCartItem, getServerCart } = await import('@/src/service/apiServices/cart.service');
  const guest = getCart();
  const marker=`${token.slice(0,16)}:${token.slice(-16)}`;
  if(localStorage.getItem('cartMergedForToken')!==marker){for (const item of guest) await addServerCartItem(item);localStorage.setItem('cartMergedForToken',marker)}
  const server = await getServerCart();
  localStorage.setItem('cart', JSON.stringify(server.items.map(({productId,variantId,quantity})=>({productId,variantId,quantity}))));
  localStorage.setItem('serverCart', JSON.stringify(server));
  notifyCartUpdated();
  return server;
}

export async function addCartItem(item:CreateOrderItemType){
  if(typeof window!=="undefined"&&localStorage.getItem('accessToken')){const {addServerCartItem}=await import('@/src/service/apiServices/cart.service');const server=await addServerCartItem(item);localStorage.setItem('serverCart',JSON.stringify(server));localStorage.setItem('cart',JSON.stringify(server.items.map(({productId,variantId,quantity})=>({productId,variantId,quantity}))));notifyCartUpdated();return}
  const cart=getCart(),index=cart.findIndex(x=>x.productId===item.productId&&(x.variantId||null)===(item.variantId||null));if(index>=0)cart[index].quantity+=item.quantity;else cart.push(item);localStorage.setItem('cart',JSON.stringify(cart));notifyCartUpdated();
}
export async function setCartItemQuantity(productId:string,variantId:string|null|undefined,quantity:number){
  if(typeof window!=="undefined"&&localStorage.getItem('accessToken')){const {getServerCart,updateServerCartItem}=await import('@/src/service/apiServices/cart.service');const server=await getServerCart(),item=server.items.find(x=>x.productId===productId&&(x.variantId||null)===(variantId||null));if(item){const updated=await updateServerCartItem(item.id,quantity);localStorage.setItem('cart',JSON.stringify(updated.items.map(({productId,variantId,quantity})=>({productId,variantId,quantity}))));localStorage.setItem('serverCart',JSON.stringify(updated));notifyCartUpdated()}return}
  const cart=getCart(),item=cart.find(x=>x.productId===productId&&(x.variantId||null)===(variantId||null));if(item)item.quantity=quantity;localStorage.setItem('cart',JSON.stringify(cart));notifyCartUpdated();
}
export async function removeCartItem(productId:string,variantId:string|null|undefined){
  if(typeof window!=="undefined"&&localStorage.getItem('accessToken')){const {getServerCart,removeServerCartItem}=await import('@/src/service/apiServices/cart.service');const server=await getServerCart(),item=server.items.find(x=>x.productId===productId&&(x.variantId||null)===(variantId||null));if(item){const updated=await removeServerCartItem(item.id);localStorage.setItem('cart',JSON.stringify(updated.items.map(({productId,variantId,quantity})=>({productId,variantId,quantity}))));localStorage.setItem('serverCart',JSON.stringify(updated));notifyCartUpdated()}return}
  localStorage.setItem('cart',JSON.stringify(getCart().filter(x=>!(x.productId===productId&&(x.variantId||null)===(variantId||null)))));notifyCartUpdated();
}
