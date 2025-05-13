import { QuotationEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { ApiResponse } from "../response";
import type { QuotationMapper } from "./quotation.mapper";
import { prisma } from "@/infrastructure/models";

export class QuotationService {
  constructor(private readonly quotationMapper: QuotationMapper) {}

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
}
