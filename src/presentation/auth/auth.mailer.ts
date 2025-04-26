import { EnvsConst } from "@/core/constants";
import { EmailService } from "@/lib";
import { EmailTemplate } from "@/lib/mailer/email.template";

export class AuthMailer extends EmailService {
  constructor() {
    super();
  }

  private async renderResetPassword(
    fullName: string,
    url: string
  ): Promise<string> {
    return EmailTemplate.render("reset-password", "Restablecer contraseña", {
      fullName,
      url,
    });
  }

  public async sendEmailForResetPassword(
    email: string,
    fullName: string,
    url: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: "Restablecer contraseña",
      html: await this.renderResetPassword(fullName, url),
      from: EnvsConst.MAILER_EMAIL,
    });
  }
}
