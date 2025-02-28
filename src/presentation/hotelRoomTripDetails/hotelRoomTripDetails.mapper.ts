import type { HotelRoomTripDetailsDto } from "@/domain/dtos";
import type { Prisma } from "@prisma/client";

type Dto = HotelRoomTripDetailsDto;

export class HotelRoomTripDetailsMapper{
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toCreate(): Prisma.hotel_room_trip_detailsUncheckedCreateInput {
    this.dto = this.dto as HotelRoomTripDetailsDto;
    return {
      hotel_room_id: this.dto.hotelRoomId,
      trip_details_id: this.dto.tripDetailsId,
      date: this.dto.date,
      number_of_people: this.dto.numberOfPeople,
      
    };
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
        }
      },

    };
  }
}
