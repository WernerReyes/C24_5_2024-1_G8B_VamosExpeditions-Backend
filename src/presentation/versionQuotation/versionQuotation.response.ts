import {
  type Quotation,
  QuotationEntity,
  VersionQuotation,
  VersionQuotationEntity,
} from "@/domain/entities";
import { ApiResponse } from "../response";

export class VersionQuotationResponse {
  public updatedVersionQuotation(versionQuotation: VersionQuotation) {
    console.log(versionQuotation);
    return new ApiResponse<VersionQuotationEntity>(
      200,
      "Versión de cotización actualizada",
      VersionQuotationEntity.fromObject(versionQuotation)
    );
  }

  public duplicatedVersionQuotation(
    versionQuotation: VersionQuotation
  ): ApiResponse<VersionQuotationEntity> {
    return {
      status: 201,
      message: "Versión de cotización duplicada",
      data: VersionQuotationEntity.fromObject(versionQuotation),
    };
  }

  public versionQuotationFound(versionQuotation: VersionQuotation) {
    return new ApiResponse<VersionQuotationEntity>(
      200,
      "Versión de cotización encontrada",
      VersionQuotationEntity.fromObject(versionQuotation)
    );
  }

  public versionsQuotationFound(versionQuotations: VersionQuotation[]) {
    return new ApiResponse<VersionQuotationEntity[]>(
      200,
      "Versión de cotización encontrada",
      versionQuotations.map((versionQuotation) =>
        VersionQuotationEntity.fromObject(versionQuotation)
      )
    );
  }

  // getQuotationResponse(quotation) {
  //     return {
  //         id: quotation.id,
  //         name: quotation.name,
  //         description: quotation.description,
  //         version: quotation.version,
  //         status: quotation.status,
  //         createdAt: quotation.createdAt,
  //         updatedAt: quotation.updatedAt,
  //         deletedAt: quotation.deletedAt,
  //     };
  // }
  // getQuotationsResponse(quotations) {
  //     return quotations.map(quotation => this.getQuotationResponse(quotation));
  // }
}
