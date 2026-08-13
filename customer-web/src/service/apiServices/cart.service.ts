import api from '@/src/service/apis/api';
import type { CreateOrderItemType } from '@/src/utils/types/order.type';
export type ServerCartItem=CreateOrderItemType&{id:string;available:boolean;unavailableReason:string|null;name:string;image:string|null;effectivePrice:number|null;stock:number;variantDescription:string|null};
export type ServerCart={id:string;status:'active'|'abandoned'|'converted';lastActivityAt:string;recoveredAt:string|null;checkoutPending:boolean;estimatedValue:number;items:ServerCartItem[]};
export const getServerCart=()=>api.get<ServerCart>('/cart').then(r=>r.data);
export const addServerCartItem=(item:CreateOrderItemType)=>api.post<ServerCart>('/cart/items',item).then(r=>r.data);
export const updateServerCartItem=(id:string,quantity:number)=>api.put<ServerCart>(`/cart/items/${id}`,{quantity}).then(r=>r.data);
export const removeServerCartItem=(id:string)=>api.delete<ServerCart>(`/cart/items/${id}`).then(r=>r.data);
export const clearServerCart=()=>api.delete<ServerCart>('/cart').then(r=>r.data);
