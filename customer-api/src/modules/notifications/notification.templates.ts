const esc = (v: unknown) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
export function renderNotification(type: string, p: any) {
  const name = esc(p.customerName || 'Customer'),
    order = esc(p.orderReference),
    store = esc(p.storeName || 'Commercor'),
    link = String(p.orderUrl || '');
  const messages: Record<string, string> = {
    order_created: 'Your order was created and payment is pending.',
    payment_completed: `Payment of ${esc(p.amount)} was completed.`,
    payment_failed: 'Your payment failed or was cancelled.',
    order_processing: 'Your order is being processed.',
    order_shipped: `Your order shipped${p.carrier ? ` with ${esc(p.carrier)}` : ''}${p.trackingNumber ? ` (${esc(p.trackingNumber)})` : ''}.`,
    order_delivered: 'Your order was delivered.',
    refund_completed: `A refund of ${esc(p.amount)} was completed.`,
    order_cancelled: 'Your order was cancelled.',
  };
  const body = messages[type] || 'There is an update to your order.';
  const text = `${store}\nHello ${name},\n${body}\nOrder: ${order}${link ? `\n${link}` : ''}`;
  return {
    text,
    html: `<div style="font-family:Arial;color:#1c1917"><h1>${store}</h1><p>Hello ${name},</p><p>${body}</p><p><strong>Order:</strong> ${order}</p>${link ? `<p><a href="${esc(link)}">View order</a></p>` : ''}${p.trackingUrl ? `<p><a href="${esc(p.trackingUrl)}">Track package</a></p>` : ''}</div>`,
  };
}
