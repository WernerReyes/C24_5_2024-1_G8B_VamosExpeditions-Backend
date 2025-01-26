import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { hotel_room } from "@prisma/client";
import { Hotel, HotelEntity } from "./hotel.entity";

export type HotelRoom = hotel_room & {
  hotel?: Hotel;
};

export class HotelRoomEntity {
  private constructor(
    private readonly id: number,
    private readonly roomType: string,
    private readonly capacity: number,
    private readonly pricePen?: number,
    private readonly priceUsd?: number,
    private readonly hotel?: HotelEntity
  ) {}

  public static fromObject(hotelRoom: HotelRoom): HotelRoomEntity {
    const {
      id_hotel_room,
      room_type,
      price_usd,

      price_pen,
      capacity,

      hotel,
    } = hotelRoom;

    const error = Validations.validateEmptyFields({
      id_hotel_room,
      room_type,
      price_usd,

      price_pen,
      capacity,
    });
    if (error) throw CustomError.badRequest(error);

    return new HotelRoomEntity(
      id_hotel_room,
      room_type.charAt(0).toUpperCase() + room_type.slice(1).toLowerCase(),
      capacity,
      Number(price_pen),
      Number(price_usd),
      hotel ? HotelEntity.fromObject(hotel) : undefined
    );
  }
}
