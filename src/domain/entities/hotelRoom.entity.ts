import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { hotel_room } from "@prisma/client";
import { Hotel, HotelEntity } from "./hotel.entity";

export type HotelRoom = hotel_room & {
  hotel?: Hotel;
};

export class HotelRoomEntity {
  public constructor(
    public readonly id: number,
    public readonly roomType: string,
    public readonly capacity: number,
    public readonly seasonType?: string,
    public readonly serviceTax?: number,
    public readonly rateUsd?: number,
    public readonly pricePen?: number,
    public readonly priceUsd?: number,
    public readonly hotel?: HotelEntity
  ) {}

  public static fromObject(hotelRoom: HotelRoom): HotelRoomEntity {
    const {
      id_hotel_room,
      room_type,
      season_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,

      hotel,
    } = hotelRoom;

    return new HotelRoomEntity(
      id_hotel_room,
      room_type.charAt(0).toUpperCase() + room_type.slice(1).toLowerCase(),
      capacity,
      season_type ?? undefined,
      Number(service_tax) ?? undefined,
      Number(rate_usd) ?? undefined,
      Number(price_pen),
      Number(price_usd),
      hotel ? HotelEntity.fromObject(hotel) : undefined
    );
  }
}
