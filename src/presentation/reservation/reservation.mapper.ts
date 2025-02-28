import type { Prisma, reservation_status } from "@prisma/client";
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
      status: this.dto.status as any as reservation_status,
      trip_details_id: this.dto.tripDetailsId,
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
     trip_details: true,
    };
  }
}
