import adminApi from '../apiInstances/adminApi.ts';
export type AbandonedCartRow={id:string;status:string;customer:{id:string;name:string;email:string}|null;itemCount:number;estimatedValue:number;lastActivityAt:string;abandonedAt:string|null;recoveryEmailSentAt:string|null;recoveredAt:string|null;convertedOrderId:string|null};
export const getAbandonedCarts=(status?:string):Promise<AbandonedCartRow[]>=>adminApi.get('/abandoned-carts',{params:status?{status}:{}}).then(r=>r.data);
