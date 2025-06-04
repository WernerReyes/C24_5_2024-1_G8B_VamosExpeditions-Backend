import { ParamsUtils } from "@/core/utils";
import { GetPartnersDto, PartnerDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = GetPartnersDto | PartnerDto;
export class PartnerMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toSelect(): Prisma.partnerSelect | undefined {
    const { select } = this.dto as GetPartnersDto;
    if (!select) return this.select;

    return ParamsUtils.parseDBSelect(select);
  }

  private get select(): Prisma.partnerSelect {
    return {
      id: true,
      name: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
      is_deleted: true,
      delete_reason: true,
    };
  }

  public get filters(): Prisma.partnerWhereInput {
    this.dto = this.dto as GetPartnersDto;
    return {
      name: this.dto.name
        ? { contains: this.dto.name, mode: "insensitive" }
        : undefined,
      created_at: this.dto.createdAt
        ? { gte: new Date(this.dto.createdAt) }
        : undefined,
      updated_at: this.dto.updatedAt
        ? { gte: new Date(this.dto.updatedAt) }
        : undefined,
      deleted_at: this.dto.deletedAt
        ? { gte: new Date(this.dto.deletedAt) }
        : undefined,
      is_deleted: this.dto.isDeleted,
      delete_reason: this.dto.deleteReason
        ? { contains: this.dto.deleteReason, mode: "insensitive" }
        : undefined,
    };
  }
  public get createPartner(): Prisma.partnerCreateInput {
    this.dto = this.dto as PartnerDto;
    return {
      name: this.dto.name,
      created_at: new Date(), 
    };
  }

  public get updatePartner(): Prisma.partnerUpdateInput {
    this.dto = this.dto as PartnerDto;
    return {
      name: this.dto.name,
       updated_at: new Date(), 
    };
  }
}
