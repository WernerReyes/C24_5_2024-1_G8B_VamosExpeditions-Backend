import { CustomError } from "@/domain/error";
import type { QuotationMapper } from "./quotation.mapper";
import type { QuotationResponse } from "./quotation.response";
import { QuotationModel, VersionQuotationModel } from "@/data/postgres";

export class QuotationService {
  constructor(
    private readonly quotationMapper: QuotationMapper,
    private readonly quotationResponse: QuotationResponse
  ) {}

  public async createQuotation(userId: number) {
    const quotation = await QuotationModel.create({
      include: this.quotationMapper.toSelectInclude,
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    const version = await VersionQuotationModel.create({
      data: this.quotationMapper.toCreateVersion(
        quotation.id_quotation,
        userId
      ),
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    quotation.version_quotation.push(version);

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
