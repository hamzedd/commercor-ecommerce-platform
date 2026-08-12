import { PaymentStatus } from '../../utils/enums/PaymentEnums';
export type VerifiedPaymentEvent={paymentId:string;provider:string;externalTransactionId:string;amount:number;currencyCode:string};
export function assertCompletion(current:string,event:VerifiedPaymentEvent,expectedAmount:number,expectedCurrency:string,existingTransactionId?:string|null){
  if(current===PaymentStatus.COMPLETED&&existingTransactionId===event.externalTransactionId)return 'duplicate' as const;
  if(current!==PaymentStatus.PENDING)throw new Error(`Invalid payment transition: ${current} -> completed`);
  if(Number(event.amount.toFixed(2))!==Number(expectedAmount.toFixed(2)))throw new Error('Paid amount does not match the order total.');
  if(event.currencyCode.toUpperCase()!==expectedCurrency.toUpperCase())throw new Error('Payment currency does not match the order currency.');
  if(!event.provider||!event.externalTransactionId)throw new Error('Verified provider and transaction reference are required.');
  return 'complete' as const;
}
