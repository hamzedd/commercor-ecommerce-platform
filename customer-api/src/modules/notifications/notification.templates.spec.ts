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
});
