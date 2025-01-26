import type { HotelRoomQuotationDto } from "@/domain/dtos";
import type { Prisma } from "@prisma/client";

type Dto = HotelRoomQuotationDto;

export class HotelRoomQuotationMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toCreate(): Prisma.hotel_room_quotationUncheckedCreateInput {
    this.dto = this.dto as HotelRoomQuotationDto;
    return {
      hotel_room_id: this.dto.hotelRoomId,
      version_number: this.dto.versionQuotationId.versionNumber,
      quotation_id: this.dto.versionQuotationId.quotationId,
      day: this.dto.day,
      number_of_people: this.dto.numberOfPeople,
    };
  }

  public get toSelectInclude(): Prisma.hotel_room_quotationInclude {
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
      version_quotation: true,
    };
  }
}
