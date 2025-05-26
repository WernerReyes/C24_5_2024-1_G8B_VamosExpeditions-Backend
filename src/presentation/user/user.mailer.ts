import { EnvsConst } from "@/core/constants";
import { EmailService } from "@/infrastructure";
import { EmailTemplate } from "@/infrastructure/mailer/email.template";

const { CLIENT_URL } = EnvsConst;

type UserMailerProps = {
  username: string;
  email: string;
  password: string;
}

export class UserMailer extends EmailService {
  private async render(data: UserMailerProps & {
    loginUrl: string;
  }): Promise<string> {
    return EmailTemplate.render("new-user", "Tu cuenta VAMOS está lista", data);
  }
  public async sendWelcomeEmail({
    username,
    email,
    password,
  }: UserMailerProps) {
    return await this.sendEmail({
      to: email,
      subject: "Tu cuenta VAMOS está lista",
      html: await this.render({
        username,
        email,
        password,
        loginUrl: CLIENT_URL,
      }),
    });
  }
}
