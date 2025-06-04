import { type HotelCategory, type IHotelModel } from "@/infrastructure/models";
import { hotel } from "@prisma/client";
import { DistritEntity } from "./distrit.entity";
import { HotelRoomEntity } from "./hotelRoom.entity";

export type HotelOmit = Omit<hotel, "distrit_id" | "category" | "address">;
export class HotelEntity {
  constructor(
    public id: number,
    public name: string,
    public category?: HotelCategory,
    public address?: string,
    public hotelRooms?: HotelRoomEntity[],
    public distrit?: DistritEntity,
    public readonly isDeleted?: boolean,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string,
  ) {}

  public static async fromObject(hotel: {
    [key: string]: any;
  }): Promise<HotelEntity> {
    const {
      id_hotel,
      name,
      category,
      distrit,
      address,
      hotel_room,
      is_deleted,
      deleted_at,
      delete_reason,
    } = hotel as IHotelModel;

    return new HotelEntity(
      id_hotel,
      name,
      category as HotelCategory,
      address ?? undefined,
      hotel_room
        ? await Promise.all(hotel_room.map(HotelRoomEntity.fromObject))
        : undefined,
      distrit ? await DistritEntity.fromObject(distrit) : undefined,
      is_deleted ?? undefined,
      deleted_at ?? undefined,
      delete_reason ?? undefined
    );
  }

  public static async fromOmittedObject(
    hotel: HotelOmit
  ): Promise<HotelEntity> {
    const { id_hotel, name } = hotel;

    return new HotelEntity(
      id_hotel,
      name,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }
}
