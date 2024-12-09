import type { accommodation_room } from "@prisma/client";
import { AccommodationEntity } from "./accommodation.entity";
import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export class AccommodationRoomEntity {
  private constructor(
    private readonly id: number,
    private readonly roomType: string,
    private readonly priceUsd: number,
    private readonly serviceTax: number,
    private readonly rateUsd: number,
    private readonly pricePen: number,
    private readonly capacity: number,
    private readonly available: boolean,
    private readonly accommodation: AccommodationEntity
  ) {}

  public static fromJson(object: {
    [key: string]: any;
  }): AccommodationRoomEntity {
    const {
      accommodation,
      id_accommodation_room,
      room_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      available,
      accommodation_id,
    } = object;
    const error = Validations.validateEmptyFields({
      accommodation,
      id_accommodation_room,
      room_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      available,
      accommodation_id,
    });

    if (error) throw CustomError.badRequest(error);

    const accommodationEntity = AccommodationEntity.fromObject(accommodation);

    return new AccommodationRoomEntity(
      id_accommodation_room,
      room_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      available,
      accommodationEntity
    );
  }
}
