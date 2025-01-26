import { GetHotelsDto } from "@/domain/dtos";
import { type Prisma } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

type Dto = GetHotelsDto;

export class HotelMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toFilterForGetAll(): Prisma.hotelWhereInput {
    this.dto = this.dto as GetHotelsDto;

    return {
      distrit: {
        city: {
          id_city: this.dto.cityId,
          country: {
            id_country: this.dto.countryId,
          },
        },
      },
    };
  }

  public get toSelectInclude(): Prisma.hotelInclude<DefaultArgs> {
    return {
      hotel_room: true,
      distrit: {
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
      },
    };
  }
}
