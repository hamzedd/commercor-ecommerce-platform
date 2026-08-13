export function canIssueInvoice(paymentStatus: string) {
  return paymentStatus.toLowerCase() === 'completed';
}
