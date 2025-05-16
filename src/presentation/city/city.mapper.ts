import { CityDto } from "@/domain/dtos/city/city.dto";
import type { Prisma } from "@prisma/client";

type Dto = CityDto;
export class CityMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get createCity(): Prisma.cityUncheckedCreateInput {
    this.dto = this.dto as CityDto;
    return {
      name: this.dto.cityName,
      country_id: this.dto.countryId,
    };
  }

  public get updateCity(): Prisma.cityUncheckedUpdateInput {
    this.dto = this.dto as CityDto;
    return {
      name: this.dto.cityName,
      country_id: this.dto.countryId,
      // updated_at: new Date(), /// TODO: add updated_at
    };
  }
}
