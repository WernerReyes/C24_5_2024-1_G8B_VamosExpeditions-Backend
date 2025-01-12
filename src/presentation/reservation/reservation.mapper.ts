import { ReservationDto } from "@/domain/dtos";
import type {
  reservation_order_type,
  reservation_traveler_style,
} from "@prisma/client";

export class ReservationMapper {
  public toRegister(
    reservationDto: ReservationDto,
    op: "create" | "update" = "create"
  ) {
    let baseData = {
      number_of_people: reservationDto.numberOfPeople,
      start_date: reservationDto.startDate,
      end_date: reservationDto.endDate,
      clientId: reservationDto.client.id,
      traveler_style:
        reservationDto.travelerStyle as any as reservation_traveler_style,
      order_type: reservationDto.orderType as any as reservation_order_type,
      additional_specifications: reservationDto.specialSpecifications,
      code: reservationDto.code,
      reservation_has_city: {
        create: Object.keys(reservationDto.destination).map((key) => ({
          city_id: +key,
        })),
      },
    };

    if (op === "create") return baseData;

    const updateData = {
      ...baseData,
      reservation_has_city: {
        deleteMany: {},
        create: baseData.reservation_has_city.create,
      },
    };

    return updateData;
  }

  public get toSelectInclude() {
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
      client: true,
    };
  }
}
