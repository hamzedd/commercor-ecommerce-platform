import {
  createEmailSender,
  EmailConfiguration,
  Mail,
} from './email.provider';

const mail: Mail = {
  to: 'customer@example.com',
  subject: 'Order paid',
  text: 'Paid',
  html: '<p>Paid</p>',
};

const configuration: EmailConfiguration = {
  provider: 'smtp',
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  user: 'mailer',
  password: 'secret',
  fromEmail: 'orders@example.com',
  fromName: 'Commercor',
};

describe('ConfiguredEmailProvider', () => {
  it('does not create a transport or send in disabled mode', async () => {
    const transportFactory = jest.fn();
    const sender = createEmailSender(
      { ...configuration, provider: 'disabled' },
      transportFactory,
    );

    expect(sender).toBeUndefined();
    expect(transportFactory).not.toHaveBeenCalled();
  });

  it('sends the trusted recipient, subject and bodies through SMTP', async () => {
    const sendMail = jest.fn().mockResolvedValue(undefined);
    const transportFactory = jest.fn().mockReturnValue({ sendMail });
    const sender = createEmailSender(configuration, transportFactory)!;

    await sender(mail);

    expect(sendMail).toHaveBeenCalledWith({
      from: { address: 'orders@example.com', name: 'Commercor' },
      ...mail,
    });
  });
});
