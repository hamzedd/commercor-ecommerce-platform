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
  if (type === 'password_reset') {
    const resetLink = esc(p.resetUrl);
    const minutes = esc(p.expiryMinutes);
    return {
      text: `${store}\nHello ${name},\nReset your password: ${p.resetUrl}\nThis link expires in ${minutes} minutes. If you didn't request this, you can ignore this email.`,
      html: `<div style="font-family:Arial;color:#1c1917"><h1>${store}</h1><p>Hello ${name},</p><p>We received a request to reset your password.</p><p><a href="${resetLink}">Reset your password</a></p><p>This link expires in ${minutes} minutes.</p><p>If you didn't request this, you can ignore this email.</p></div>`,
    };
  }
  if (type === 'abandoned_cart') {
    const cartLink = esc(p.cartUrl);
    return { text: `${store}\nHello ${name},\nYour cart is waiting. Return to cart: ${p.cartUrl}`, html: `<div style="font-family:Arial;color:#1c1917"><h1>${store}</h1><p>Hello ${name},</p><p>Your cart is waiting${p.itemCount ? ` with ${esc(p.itemCount)} item(s)` : ''}.</p><p><a href="${cartLink}">Return to cart</a></p></div>` };
  }
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
  const invoice = p.invoiceNumber ? `\nInvoice: ${esc(p.invoiceNumber)}` : '';
  const text = `${store}\nHello ${name},\n${body}\nOrder: ${order}${invoice}${link ? `\n${link}` : ''}`;
  return {
    text,
    html: `<div style="font-family:Arial;color:#1c1917"><h1>${store}</h1><p>Hello ${name},</p><p>${body}</p><p><strong>Order:</strong> ${order}</p>${p.invoiceNumber ? `<p><strong>Invoice:</strong> ${esc(p.invoiceNumber)}</p>` : ''}${link ? `<p><a href="${esc(link)}">View order</a></p>` : ''}${p.trackingUrl ? `<p><a href="${esc(p.trackingUrl)}">Track package</a></p>` : ''}</div>`,
  };
}
