import { type DefaultArgs } from "@prisma/client/runtime/library";
import type { Prisma, quotation_status } from "@prisma/client";
import type {
  DuplicateVersionQuotationDto,
  VersionQuotationDto,
} from "@/domain/dtos";
import type { VersionQuotation } from "@/domain/entities";
import { Validations } from "@/core/utils";

type Dto = DuplicateVersionQuotationDto | VersionQuotationDto;

const FROM = "VersionQuotationMapper";

export class VersionQuotationMapper {
  private dto: Dto;
  private versionQuotation: VersionQuotation;

  constructor() {
    this.dto = {} as Dto;
    this.versionQuotation = {} as VersionQuotation;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public set setVersionQuotation(versionQuotation: VersionQuotation) {
    this.versionQuotation = versionQuotation;
  }

  public get findById(): Prisma.version_quotationFindUniqueArgs {
    this.validateModelInstance(this.dto, "findById");
    return {
      where: {
        version_number_quotation_id: {
          version_number: this.dto.id.versionNumber,
          quotation_id: this.dto.id.quotationId,
        },
      },
    };
  }

  public get toUpdate(): Prisma.version_quotationUncheckedUpdateInput {
    this.validateModelInstance(this.dto, "toUpdate");
    const dto = this.dto as VersionQuotationDto;
    console.log({ dto });
    return {
      indirect_cost_margin: dto.indirectCostMargin,
      profit_margin: dto.profitMargin,
      total_cost: dto.totalCost,
      final_price: dto.finalPrice,
      reservation_id: dto.reservationId,
      official: dto.official,
      status: dto.status as quotation_status,
    };
  }

  public get toDuplicate(): Prisma.version_quotationUncheckedCreateInput {
    this.validateModelInstance(
      [this.versionQuotation, this.dto],
      "toDuplicate"
    );

    const dto = this.dto as DuplicateVersionQuotationDto;

    const { quotation, hotel_room_quotation, ...rest } = this.versionQuotation;

    const maxVersion = quotation?.version_quotation?.reduce((prev, current) =>
      prev.version_number > current.version_number ? prev : current
    ).version_number;

    return {
      ...rest,
      user_id: dto.userId,
      status: this.versionQuotation.status,
      version_number: maxVersion! + 1,
      official: false,
    };
  }

  public get toSelectInclude(): Prisma.version_quotationInclude<DefaultArgs> {
    return {
      user: true,
      reservation: true,
    };
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
