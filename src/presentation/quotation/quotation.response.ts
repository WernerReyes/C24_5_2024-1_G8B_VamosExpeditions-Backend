import { type Quotation, QuotationEntity } from "@/domain/entities";
import { ApiResponse } from "../response";

export class QuotationResponse {
  public createdQuotation(quotation: Quotation): ApiResponse<QuotationEntity> {
    return new ApiResponse<QuotationEntity>(
      201,
      "Cotización creada",
      QuotationEntity.fromObject(quotation)
    );
  }

  public quotationsFound(
    quotations: Quotation[]
  ): ApiResponse<QuotationEntity[]> {
    return new ApiResponse<QuotationEntity[]>(
      200,
      "Cotizaciones encontradas",
      quotations.map(QuotationEntity.fromObject)
    );
  }
}
