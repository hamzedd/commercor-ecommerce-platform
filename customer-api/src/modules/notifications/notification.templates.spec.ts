import { renderNotification } from './notification.templates';
describe('notification templates', () => {
  it('renders recipient-safe content without secrets', () => {
    const rendered = renderNotification('payment_completed', {
      customerName: 'A <B>',
      orderReference: 'order',
      amount: 10,
      accessToken: 'secret',
    });
    expect(rendered.html).toContain('A &lt;B&gt;');
    expect(rendered.text).not.toContain('secret');
  });

  it.each([
    [
      'password_reset',
      { resetUrl: 'https://store.test/reset?token=qa', expiryMinutes: 30 },
    ],
    ['abandoned_cart', { cartUrl: 'https://store.test/cart', itemCount: 2 }],
    [
      'order_shipped',
      {
        carrier: '<Carrier>',
        trackingNumber: '<TRACK>',
        trackingUrl: 'https://carrier.test/track',
      },
    ],
    ['refund_completed', { amount: '5.00' }],
  ])('renders safe HTML and a plain-text body for %s', (type, payload) => {
    const rendered = renderNotification(type, {
      customerName: '<Customer>',
      storeName: '<Store>',
      orderReference: 'QA-ORDER',
      ...payload,
    });
    expect(rendered.html).toContain('&lt;Customer&gt;');
    expect(rendered.html).toContain('&lt;Store&gt;');
    expect(rendered.html).not.toContain('<Customer>');
    expect(rendered.text.length).toBeGreaterThan(20);
  });

  it('does not emit executable or malformed CTA links', () => {
    const rendered = renderNotification('order_shipped', {
      customerName: 'QA',
      orderReference: 'QA-ORDER',
      orderUrl: 'javascript:alert(1)',
      trackingUrl: 'data:text/html,bad',
    });
    expect(rendered.html).not.toContain('javascript:');
    expect(rendered.html).not.toContain('data:text');
  });
});
