import { CustomError } from "@/domain/error";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { EmailService, SendMailOptions } from "../nodemailer/email.service";
import { PdfService } from "../pdfmake/pdf.service";
import { Strategy } from "./context.strategy";
import { reportTransport, reportHotel } from "@/report";
import { TripDetailsModel } from "@/data/postgres";
import { HotelReportPDF } from "@/report/pdf-reports/report.hotel.pdf";

export class EmailStrategy implements Strategy {
  constructor(
    private emailService: EmailService,
    private pdfService: PdfService,
    private cloudinaryService: CloudinaryService
  ) {}

  async sendMailWithPDF(data: SendMailOptions): Promise<boolean> {
    try {
      const queryResult = await this.queryResultDB(
        data.type || "",
        Number(data.reservationId) || 0
      );

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

      
      return true;
    } catch (error) {
      throw CustomError.internalServer("Error interno del servidor");
    }
  }

  private async queryResultDB(
    type: string,
    reservationId: number
  ): Promise<any> {
    switch (type) {
      case "Transporte":
        return { destino: "Lima", fecha: "2024-02-11", pasajero: "Juan Pérez" };
      case "Alojamiento":
        return await TripDetailsModel.findMany({
          where: { id: reservationId },
          omit: {
            client_id: true,
          },
          include: {
            client: {
              omit: {
                createdAt: true,
                updatedAt: true,
              },
            },
            hotel_room_trip_details: {
              orderBy: {
                date: "asc",
              },
              include: {
                hotel_room: {
                  include: {
                    hotel: {},
                  },
                },
              },
            },
            version_quotation: {
              omit: {
                created_at: true,
                updated_at: true,
              },
              include: {
                quotation: {
                  omit: {
                    created_at: true,
                    updated_at: true,
                  },
                },
                user: {
                  omit: {
                    id_role: true,
                    password: true,
                   
                  },
                },
              },
            },
          },
        });
      default:
        throw CustomError.badRequest("Tipo de servicio no soportado");
    }
  }

  private generatePDF(type: string, data: any): any {

    const hotelReportPDF = new HotelReportPDF();

    switch (type) {
      case "Transporte":
        return reportTransport();
      case "Alojamiento":
        return hotelReportPDF.generateReport({
          title: "",
          subTitle: "",
          dataQuey: data,
        });
      default:
        throw CustomError.badRequest("Tipo de servicio no soportado");
    }
  }
}
