import { EnvsConst } from "@/core/constants";
import { EmailService } from "@/infrastructure";
import { EmailTemplate } from "@/infrastructure/mailer/email.template";

export class AuthMailer extends EmailService {
  constructor() {
    super();
  }

  public async sendEmailForResetPassword(
    email: string,
    fullName: string,
    url: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: "Restablecer contraseña",
      html: EmailTemplate.render("reset-password", "Restablecer contraseña", {
        fullName,
        url,
      }),
      from: EnvsConst.MAILER_EMAIL,
    });
  }

  public async sendEmailForVerify2FA(
    email: string,
    username: string,
    url: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: "Verificación de Cuenta",
      html: EmailTemplate.render("2fa", "Verificación de Cuenta", {
        username,
        url,
      }),
      from: EnvsConst.MAILER_EMAIL,
    });
  }
}
