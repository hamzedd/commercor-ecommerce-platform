import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import {
  EMAIL_PROVIDER,
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from '@/src/utils/environmentConstants';
export type Mail = { to: string; subject: string; text: string; html: string };
export abstract class EmailProvider {
  abstract sendMail(mail: Mail): Promise<void>;
}

export type EmailConfiguration = {
  provider: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
};

const runtimeConfiguration: EmailConfiguration = {
  provider: EMAIL_PROVIDER,
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  user: SMTP_USER,
  password: SMTP_PASSWORD,
  fromEmail: SMTP_FROM_EMAIL,
  fromName: SMTP_FROM_NAME,
};

export function createEmailSender(
  configuration: EmailConfiguration,
  transportFactory = nodemailer.createTransport,
) {
  if (configuration.provider === 'disabled') return undefined;
  const transport = transportFactory({
    host: configuration.host,
    port: configuration.port,
    secure: configuration.secure,
    auth: configuration.user
      ? { user: configuration.user, pass: configuration.password }
      : undefined,
  });
  return (mail: Mail) =>
    transport.sendMail({
      from: {
        address: configuration.fromEmail,
        name: configuration.fromName,
      },
      ...mail,
    });
}

@Injectable()
export class ConfiguredEmailProvider extends EmailProvider {
  private readonly logger = new Logger(ConfiguredEmailProvider.name);
  private readonly sender = createEmailSender(runtimeConfiguration);

  async sendMail(mail: Mail) {
    if (!this.sender) {
      this.logger.log(`Email disabled; skipped ${mail.subject}`);
      return;
    }
    await this.sender(mail);
  }
}
