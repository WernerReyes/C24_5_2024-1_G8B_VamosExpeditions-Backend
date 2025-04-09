import { CustomError } from "@/domain/error";
import type { QuotationMapper } from "./quotation.mapper";
import { prisma, QuotationModel } from "@/data/postgres";
import { ContextStrategy } from "../../lib/strategies/context.strategy";
import { Reportdto } from "@/domain/dtos";
import { ReservationType } from "@/lib";
import { ApiResponse } from "../response";
import { QuotationEntity } from "@/domain/entities";

export class QuotationService {
  constructor(
    private readonly quotationMapper: QuotationMapper,
    private readonly contextStrategy: ContextStrategy
  ) {}

  public async createQuotation(userId: number) {
    const quotation = await prisma
      .$transaction(async (tx) => {
        const quotation = await tx.quotation.create({
          include: this.quotationMapper.toSelectInclude,
        });

        const version = await tx.version_quotation.create({
          data: this.quotationMapper.toCreateVersion(
            quotation.id_quotation,
            userId
          ),

          include: {
            user: true,
          },
        });

        quotation.version_quotation.push(version);

        return quotation;
      })
      .catch((error) => {
        throw CustomError.internalServer(`${error}`);
      });

    return new ApiResponse<QuotationEntity>(
      200,
      "Cotización creada correctamente",
      await QuotationEntity.fromObject(quotation)
    );
  }

  public async getQuotations() {
    const quotations = await QuotationModel.findMany({
      include: this.quotationMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    return new ApiResponse<QuotationEntity[]>(
      200,
      "Lista de cotizaciones",
      await Promise.all(quotations.map(QuotationEntity.fromObject))
    );
  }

  public async sendEmailAndPdf(reportdto: Reportdto) {
    const resultSend = await this.contextStrategy.executeStrategy({
      to: reportdto.to,
      subject: reportdto.subject,
      type: reportdto.resources as ReservationType,
      htmlBody: reportdto.description,
      reservationId: reportdto.reservationId,
      from: reportdto.from,
    });

    if (!resultSend) {
      throw CustomError.internalServer("Error sending email");
    }

    if (resultSend) {
      return {
        message: "Email sent successfully",
      };
    }
  }
}
