import { EnvsConst } from "@/core/constants";
import nodemailer, { Transporter } from "nodemailer";

export type ReservationType = "Hotel" | "Flight" | "Tour" | "Alojamiento" | "Transporte";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody?: string;
  attachements?: Attachement[];
  type?: ReservationType;
  queryResult?: any;
}

export interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: EnvsConst.MAILER_SERVICE,
      auth: {
        user: EnvsConst.MAILER_EMAIL,
        pass: EnvsConst.MAILER_SECRET_KEY,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });


      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
