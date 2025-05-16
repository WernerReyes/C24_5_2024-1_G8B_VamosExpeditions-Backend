import { DistritDto } from "@/domain/dtos/distrit/distrit.dto";
import type { Prisma } from "@prisma/client";

type Dto = DistritDto;

export class DistritMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get createDistrit(): Prisma.distritCreateInput {
    this.dto = this.dto as DistritDto;
    return {
      name: this.dto.distritName,
      city: {
        connect: {
          id_city: this.dto.cityId,
          country_id: this.dto.countryId,
        },
      },
    };
  }

  public get updateDistrit(): Prisma.distritUpdateInput {
    this.dto = this.dto as DistritDto;
    return {
      name: this.dto.distritName,
      city: {
        connect: {
          id_city: this.dto.cityId,
          country_id: this.dto.countryId,
        },
      },
      // updated_at: new Date() // TODO: add updated_at
    };
  }
}
