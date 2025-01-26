import { CustomError } from "@/domain/error";
import type { QuotationMapper } from "./quotation.mapper";
import type { QuotationResponse } from "./quotation.response";
import { QuotationModel } from "@/data/postgres";


export class QuotationService {
  constructor(
    private readonly quotationMapper: QuotationMapper,
    private readonly quotationResponse: QuotationResponse
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
}
