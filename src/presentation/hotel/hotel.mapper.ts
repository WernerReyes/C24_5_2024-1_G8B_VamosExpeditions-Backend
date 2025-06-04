import { Validations } from "@/core/utils";
import { GetHotelsDto, GetHotelsPageDto, HotelDto } from "@/domain/dtos";
import { type Prisma, hotel } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

type Dto = GetHotelsDto | GetHotelsPageDto | HotelDto;

const FROM = "HotelMapper";

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
    this.validateModelInstance(this.dto, "toSelectInclude");
    this.dto = this.dto as GetHotelsPageDto;
    
    return {
      hotel_room: {
        where: {
          is_deleted: this.dto.isDeleted,
        },
        select: {
          id_hotel_room: true,
          room_type: true,
          season_type: true,
          price_usd: true,
          service_tax: true,
          rate_usd: true,
          price_pen: true,
          capacity: true,
          hotel_id: true,
          deleted_at: true,
          is_deleted: true,
          delete_reason: true,
          created_at: true,
          updated_at: true,

        }
      },
      distrit: {
        select: {
          id_distrit: true,
          name: true,
          city: {
            select: {
              id_city: true,
              name: true,
              country: {
                select: {
                  id_country: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    };
  }

  public get getHotelWhere(): Prisma.hotelWhereInput {
    this.validateModelInstance(this.dto, "getHotelWhere");
    
    this.dto = this.dto as GetHotelsPageDto;
    return {
      name: {
        contains: this.dto.name?.trim(),
        mode: "insensitive",
      },
      distrit: {
        name: {
          contains: this.dto.distrit?.trim(),
          mode: "insensitive",
        },
      },
      category: {
        contains: this.dto.category,
        mode: "insensitive",
      },
    OR: [
      { is_deleted: this.dto.isDeleted },
      {
        AND: [
          { is_deleted: false },
          {
            hotel_room: {
              some: {
                is_deleted: true
              }
            }
          }
        ]
      }
    ],
      

    };
  }

  //! start create , update, hotel
  public get createHotel(): Prisma.hotelUncheckedCreateInput {
    this.validateModelInstance(this.dto, "createHotel");
    this.dto = this.dto as HotelDto;
    return {
      category: this.dto.category,
      name: this.dto.name,
      address: this.dto.address,
      distrit_id: this.dto.distrit,
    };
  }

  public get updateHotel(): Prisma.hotelUncheckedUpdateInput {
    this.validateModelInstance(this.dto, "updateHotel");
    this.dto = this.dto as HotelDto;
    
    return {
      name: this.dto.name,
      address: this.dto.address,
      distrit_id: this.dto.distrit,
      category: this.dto.category,
      updated_at: new Date(),
    };
  }

  //! end create , update, hotel

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
