import { EnvsConst } from "@/core/constants";
import { CustomError } from "@/domain/error";
import nodemailer, { Transporter } from "nodemailer";
import { EmailTemplate } from "./email.template";
import { AllowVersionQuotationType, VersionQuotation } from "@/domain/entities";
import type { Options } from "nodemailer/lib/mailer";

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

  private async sendEmail(options: Options): Promise<boolean> {
    try {
      await this.transporter.sendMail(options);

      return true;
    } catch (error) {
      throw CustomError.internalServer("Error sending email" + error);
    }
  }

  public async sendEmailForResetPassword(
    email: string,
    fullName: string,
    url: string
  ): Promise<boolean> {
    this.sendEmail({
      to: email,
      subject: "Restablecer contraseña",
      html: await EmailTemplate.renderResetPassword(fullName, url),
      from: EnvsConst.MAILER_EMAIL,
    });
    return true;
  }

  public async sendEmailForVersionQuotation(
    data: {
      versionQuotation: VersionQuotation;
      serviceType: AllowVersionQuotationType;
      description?: string;
    },
    options: Options
  ): Promise<boolean> {
    this.sendEmail({
      html: await EmailTemplate.renderVersionQuotation({
        quotationId: `Q${data.versionQuotation.quotation_id}-V${data.versionQuotation.version_number}`,
        quotationName: data.versionQuotation.name,
        serviceType: data.serviceType,

        description: data.description,
      }),
      subject: `Cotización ${data.versionQuotation.name}`,
      ...options,
    });
    return true;
  }
}
