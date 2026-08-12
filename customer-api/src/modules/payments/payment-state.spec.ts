import {assertCompletion,VerifiedPaymentEvent} from './payment-state'; import {PaymentStatus} from '../../utils/enums/PaymentEnums';
const event:VerifiedPaymentEvent={paymentId:'p',provider:'verified-provider',externalTransactionId:'tx-1',amount:100,currencyCode:'USD'};
describe('payment completion policy',()=>{
 it('rejects amount mismatch',()=>expect(()=>assertCompletion(PaymentStatus.PENDING,{...event,amount:99},100,'USD')).toThrow('amount'));
 it('rejects currency mismatch',()=>expect(()=>assertCompletion(PaymentStatus.PENDING,{...event,currencyCode:'EUR'},100,'USD')).toThrow('currency'));
 it('allows pending completion',()=>expect(assertCompletion(PaymentStatus.PENDING,event,100,'USD')).toBe('complete'));
 it('makes duplicate completion idempotent',()=>expect(assertCompletion(PaymentStatus.COMPLETED,event,100,'USD','tx-1')).toBe('duplicate'));
 it.each([PaymentStatus.FAILED,PaymentStatus.CANCELLED,PaymentStatus.REFUNDED])('rejects invalid transition from %s',(status)=>expect(()=>assertCompletion(status,event,100,'USD')).toThrow('Invalid payment transition'));
 it('rejects a forged event without provider reference',()=>expect(()=>assertCompletion(PaymentStatus.PENDING,{...event,provider:'',externalTransactionId:''},100,'USD')).toThrow('required'));
});
