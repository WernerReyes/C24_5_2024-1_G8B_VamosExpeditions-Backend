import { EnvsConst } from "@/core/constants";
import { CustomError } from "@/domain/error";
import nodemailer, { Transporter } from "nodemailer";

export type ReservationType =
  | "Hotel"
  | "Flight"
  | "Tour"
  | "Alojamiento"
  | "Transporte";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody?: string;
  attachements?: Attachement[];
  from: string;
  type?: ReservationType;
  queryResult?: any;
  // reservationId?: number;
  versionQuotationId: {
    quotationId: number;
    versionNumber: number;
  };
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

  async sendEmail(
    options: Omit<SendMailOptions, "versionQuotationId">
  ): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [], from } = options;

    try {
      await this.transporter.sendMail({
        to: to,
        from,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      return true;
    } catch (error) {
      throw CustomError.internalServer("Error sending email" + error);
    }
  }
}
