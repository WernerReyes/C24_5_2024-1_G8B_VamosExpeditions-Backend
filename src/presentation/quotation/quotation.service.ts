import { CustomError } from "@/domain/error";
import type { QuotationMapper } from "./quotation.mapper";
import type { QuotationResponse } from "./quotation.response";
import { QuotationModel } from "@/data/postgres";
import { ContextStrategy } from "../../lib/strategies/context.strategy";
import { Reportdto } from "@/domain/dtos";
import { ReservationType } from "@/lib";

export class QuotationService {
  constructor(
    private readonly quotationMapper: QuotationMapper,
    private readonly quotationResponse: QuotationResponse,
    private readonly contextStrategy: ContextStrategy
  ) {}

  public async createQuotation(userId: number) {
    const quotation = await QuotationModel.create({
      data: this.quotationMapper.toCreate(userId),
      include: this.quotationMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    return this.quotationResponse.createdQuotation(quotation);
  }

  public async getQuotations() {
    const quotations = await QuotationModel.findMany({
      include: this.quotationMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    return this.quotationResponse.quotationsFound(quotations);
  }

  public async sendEmailAndPdf(reportdto: Reportdto) {
    try {
      await this.contextStrategy.executeStrategy({
        to: reportdto.to,
        subject: reportdto.subject,
        type: reportdto.resources as ReservationType,
        htmlBody: reportdto.description,
      });
      return {
        message: "Email sent successfully",
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
