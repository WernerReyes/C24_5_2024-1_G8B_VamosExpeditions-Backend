import { EmailService, type Options } from "@/infrastructure";
import { EmailTemplate } from "@/infrastructure/mailer/email.template";
import type { AllowVersionQuotationType, IVersionQuotationModel } from "@/infrastructure/models";

export class VersionQuotationMailer extends EmailService {
  constructor() {
    super();
  }

  private async render(data: {
    quotationId: string;
    quotationName: string;
    serviceType: AllowVersionQuotationType;
    description?: string;
  }): Promise<string> {
    return EmailTemplate.render("send-quotation", "Cotización", data);
  }

  public async sendEmailVQ(
    data: {
      versionQuotation: IVersionQuotationModel;
      serviceType: AllowVersionQuotationType;
      description?: string;
    },
    options: Options
  ): Promise<boolean> {
    this.sendEmail({
      html: await this.render({
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
