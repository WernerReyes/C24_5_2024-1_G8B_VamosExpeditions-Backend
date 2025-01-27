import type {
  Prisma,
  reservation_order_type,
  reservation_status,
  reservation_traveler_style,
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { ReservationDto } from "@/domain/dtos";

type Dto = ReservationDto;

export class ReservationMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toUpsert(): Prisma.reservationUncheckedCreateInput {
    this.dto = this.dto as ReservationDto;
    return {
      number_of_people: this.dto.numberOfPeople,
      start_date: this.dto.startDate,
      end_date: this.dto.endDate,
      clientId: this.dto.client.id,
      status: this.dto.status as any as reservation_status,
      traveler_style: this.dto
        .travelerStyle as any as reservation_traveler_style,
      order_type: this.dto.orderType as any as reservation_order_type,
      additional_specifications: this.dto.specialSpecifications,
      code: this.dto.code,
      reservation_has_city: {
        create: Object.keys(this.dto.destination).map((key) => ({
          city_id: +key,
        })),
      },
    };

    // if (this.dto.id === 0) return baseData;

    // const updateData = {
    //   ...baseData,
    //   reservation_has_city: {
    //     deleteMany: {},
    //     create: baseData.reservation_has_city.create,
    //   },
    // };

    // return updateData;
  }

  public get toSelectInclude(): Prisma.reservationInclude<DefaultArgs> {
    return {
      reservation_has_city: {
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
      },
      version_quotation: true,
      client: true,
    };
  }
}
