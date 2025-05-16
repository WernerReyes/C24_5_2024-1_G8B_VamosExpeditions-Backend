import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { AllowVersionQuotationType } from "../models";

const TEMPLATE_DIR = path.resolve(__dirname, "../../infrastructure/mailer/templates");
export class EmailTemplate {
  public static render(templateName: string, title: string, data: any): string {
    const layoutPath = path.join(TEMPLATE_DIR, "layout.hbs");
    const contentPath = path.join(TEMPLATE_DIR, `${templateName}.hbs`);

    const layoutSource = fs.readFileSync(layoutPath, "utf8");
    const contentSource = fs.readFileSync(contentPath, "utf8");

    const contentTemplate = Handlebars.compile(contentSource);
    const layoutTemplate = Handlebars.compile(layoutSource);

    const body = contentTemplate(data);

    return layoutTemplate({
      title,
      ...data,
      year: new Date().getFullYear(),
      body,
    });
  }

  public static async renderVersionQuotation(data: {
    quotationId: string;
    quotationName: string;
    serviceType: AllowVersionQuotationType;
    description?: string;
  }): Promise<string> {
    return EmailTemplate.render("send-quotation", "Cotización", data);
  }
}
