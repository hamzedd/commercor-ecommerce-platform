import adminApi from '../apiInstances/adminApi.ts';

export type Invoice = { id:string; invoiceNumber:string; orderId:string; issuedAt:string; currencyCode:string; totalAmount:number; currentRefundedAmount:number; customerSnapshot:{name?:string;email?:string} };
export const getInvoices = ():Promise<Invoice[]> => adminApi.get('/invoices').then(response => response.data);
export const downloadInvoice = (id:string):Promise<Blob> => adminApi.get(`/invoices/${id}/pdf`,{responseType:'blob'}).then(response => response.data);
