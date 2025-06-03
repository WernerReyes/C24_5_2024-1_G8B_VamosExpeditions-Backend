import { DateAdapter } from "@/core/adapters";
import type {
  InsertManyDetailsTripDetailsDto,
  UpdateManyDetailsTripDetailsByDateDto
} from "@/domain/dtos";
import type { Prisma } from "@prisma/client";

type Dto =
  | InsertManyDetailsTripDetailsDto
  | UpdateManyDetailsTripDetailsByDateDto;

export class HotelRoomTripDetailsMapper {
  private dto: Dto;
 
  constructor() {
    this.dto = {} as Dto;

  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  

  public get createMany(): Prisma.hotel_room_trip_detailsCreateManyInput[] {
    const dto = this.dto as InsertManyDetailsTripDetailsDto;
    const dates = DateAdapter.eachDayOfInterval(
      dto.dateRange[0],
      dto.dateRange[1]
    );

    const dataToInsert = dates.flatMap((date) => {
      return Array.from({ length: dto.countPerDay }, () => ({
        hotel_room_id: dto.id,
        trip_details_id: dto.tripDetailsId,
        date,
        cost_person: dto.costPerson,
      }));
    });

    return dataToInsert;
  }


  public get toSelectInclude(): Prisma.hotel_room_trip_detailsInclude {
    return {
      hotel_room: {
        include: {
          hotel: {
            include: {
              distrit: {
                select: null,
                include: {
                  city: true,
                },
              },
            },
          },
        },
      },
      trip_details: {
        include: {
          version_quotation: true,
        },
      },
    };
  }
}
