import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type Prisma, version_quotation_status } from "@prisma/client";

export class QuotationMapper {
  public toCreateVersion(
    quotationId: number,
    userId: number
  ): Prisma.version_quotationUncheckedCreateInput {
    return {
      quotation_id: quotationId,
      name: `Q-${new Date().getFullYear()}-${quotationId}`,
      user_id: userId,
      status: version_quotation_status.DRAFT,
      version_number: 1,
      official: true,
    };
  }

  public get toSelectInclude(): Prisma.quotationInclude<DefaultArgs> {
    return {
      version_quotation: true
    };
  }
}
