import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type Prisma, quotation_status } from "@prisma/client";

export class QuotationMapper {
  public toCreate(userId: number): Prisma.quotationUncheckedCreateInput {
    return {
      version_quotation: {
        create: {
          user_id: userId,
          status: quotation_status.DRAFT,
          version_number: 1,
          official: true,
        },
      },
    };
  }

  public get toSelectInclude(): Prisma.quotationInclude<DefaultArgs> {
    return {
      version_quotation: {
        include: {
          user: true,
          reservation: true,
          hotel_room_quotation: true,
        },
      },
    };
  }
}
