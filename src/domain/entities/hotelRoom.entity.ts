import type { IHotelRoomModel } from "@/infrastructure/models";
import { HotelEntity } from "./hotel.entity";

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
    public readonly isDeleted?: boolean,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string,
    public readonly hotel?: HotelEntity
  ) {}

  public static async fromObject(hotelRoom: {
    [key: string]: any;
  }): Promise<HotelRoomEntity> {
    const {
      id_hotel_room,
      room_type,
      season_type,
      price_usd,
      service_tax,
      rate_usd,
      price_pen,
      capacity,
      is_deleted,
      deleted_at,
      delete_reason,

      hotel,
    } = hotelRoom as IHotelRoomModel;

    return new HotelRoomEntity(
      id_hotel_room,
      room_type.charAt(0).toUpperCase() + room_type.slice(1).toLowerCase(),
      capacity,
      season_type ?? undefined,
      Number(service_tax) ?? undefined,
      Number(rate_usd) ?? undefined,
      Number(price_pen),
      Number(price_usd),
      is_deleted ?? undefined,
      deleted_at ?? undefined,
      delete_reason ?? undefined,
      hotel ? await HotelEntity.fromObject(hotel) : undefined
    );
  }
}
