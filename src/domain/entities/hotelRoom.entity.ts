import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export class HotelRoomEntity {
  private constructor(
    private readonly id: number,
    private readonly roomType: string,
    private readonly priceUsd: number,
    private readonly serviceTax: number,
    private readonly rateUsd: number,
    private readonly pricePen: number,
    private readonly capacity: number,
    private readonly available: boolean
  ) {}

  public static fromJson(object: { [key: string]: any }): HotelRoomEntity {
    const {
      id_hotel_room,
      room_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      available,
    } = object;

    const error = Validations.validateEmptyFields({
      id_hotel_room,
      room_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      available,
    });
    if (error) throw CustomError.badRequest(error);

    return new HotelRoomEntity(
      id_hotel_room,
      room_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      available
    );
  }
}
