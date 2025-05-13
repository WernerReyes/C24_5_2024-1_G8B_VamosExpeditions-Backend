import { EnvsConst } from "@/core/constants";
import type { } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import nodemailer, { Transporter } from "nodemailer";
import type { Options as OptionsNodemailer } from "nodemailer/lib/mailer";

export interface Options extends OptionsNodemailer {}

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

  protected async sendEmail(options: Options): Promise<boolean> {
    try {
      await this.transporter.sendMail(options);

      return true;
    } catch (error) {
      throw CustomError.internalServer("Error sending email" + error);
    }
  }

}
