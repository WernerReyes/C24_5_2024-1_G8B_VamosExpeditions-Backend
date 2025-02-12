import { CustomError } from "@/domain/error";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { EmailService, SendMailOptions } from "../nodemailer/email.service";
import { PdfService } from "../pdfmake/pdf.service";
import { Strategy } from "./context.strategy";
import { reportTransport, reportHotel } from "@/report";

export class EmailStrategy implements Strategy {
  constructor(
    private emailService: EmailService,
    private pdfService: PdfService,
    private cloudinaryService: CloudinaryService
  ) {}

  async sendMailWithPDF(data: SendMailOptions): Promise<void> {
    try {
      const queryResult = this.queryResultDB(data.type || "");
      const pdfData = this.generatePDF(data.type || "", queryResult);

      if (!pdfData) {
        throw new Error("PDF data is undefined");
      }
      const pdfBuffer = await this.pdfService.createPdfEmail(pdfData);

      const { secure_url } =
        (await this.cloudinaryService.uploadImage({
          filePath: pdfBuffer,
          folder: "reservations",
        })) || {};

      await this.emailService.sendEmail({
        to: data.to,
        subject: data.subject,
        htmlBody: `
            
            <p>${data.htmlBody}</p>
          `,
        attachements: [
          {
            filename: "reporte.pdf",
            path: secure_url || "",
          },
        ],
      });
    } catch (error) {
      console.error("Error en sendMailWithPDF:", error);
      throw CustomError.internalServer("Error interno del servidor");
    }
  }

  private async queryResultDB(type: string): Promise<any> {
    switch (type) {
      case "Transporte":
        return { destino: "Lima", fecha: "2024-02-11", pasajero: "Juan Pérez" };
      case "Alojamiento":
        return { hotel: "Hotel Central", noches: 3, huesped: "Ana Gómez" };
      default:
        throw CustomError.badRequest("Tipo de servicio no soportado");
    }
  }

  private generatePDF(type: string, data: any): any {
    switch (type) {
      case "Transporte":
        return reportTransport();
      case "Alojamiento":
        return reportHotel();
      default:
        throw CustomError.badRequest("Tipo de servicio no soportado");
    }
  }
}
