import { CountryDto } from "@/domain/dtos/country/county.dto";
import type { Prisma } from "@prisma/client";

type Dto = CountryDto;

export class CountryMapper {
    
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get createCountry(): Prisma.countryUncheckedCreateInput {
    this.dto = this.dto as CountryDto;
    return {
      name: this.dto.countryName,
      code: this.dto.countryCode,
    };
  }

  public get updateCountry(): Prisma.countryUncheckedUpdateInput {
    this.dto = this.dto as CountryDto;
    return {
      name: this.dto.countryName,
      code: this.dto.countryCode,
      updated_at: new Date(),
    };
  }
}
