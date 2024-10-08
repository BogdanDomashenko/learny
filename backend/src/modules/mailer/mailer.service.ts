import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';

interface SendMailInput {
  to: string;
  subject: string;
  /** Handlebars template */
  template?: string;
  /** Variables to be used in the template */
  variables?: Record<string, any>;
}

@Injectable()
export class MailerService {
  private readonly mailer: nodemailer.Transporter;
  private readonly from: string;

  constructor(configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const port = Number(configService.get<string>('SMTP_PORT'));
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASS');
    this.from = configService.get<string>('EMAIL_FROM');

    this.mailer = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: user && pass ? { user, pass } : false,
    } as nodemailer.TransportOptions);
  }

  sendMail({ to, subject, template, variables }: SendMailInput) {
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(variables);

    return this.mailer.sendMail({
      from: this.from,
      to,
      subject,
      html: html,
    });
  }
}
