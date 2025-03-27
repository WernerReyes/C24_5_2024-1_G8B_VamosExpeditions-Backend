import { hotel, hotel_room } from "@prisma/client";
import { Distrit, DistritEntity } from "./distrit.entity";
import { HotelRoomEntity } from "./hotelRoom.entity";

export type Hotel = hotel & {
  hotel_room?: hotel_room[];
  distrit?: Distrit;
};

export enum HotelCategory {
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  BOUTIQUE = "BOUTIQUE",
  VILLA = "VILLA",
  LODGE = "LODGE",
}
export class HotelEntity {
  constructor(
    public id: number,
    public name: string,
    public category: HotelCategory,
    public address?: string,
    public hotelRooms?: HotelRoomEntity[],
    public distrit?: DistritEntity
  ) {}

  public static fromObject(hotel: Hotel): HotelEntity {
    const { id_hotel, name, category, distrit, address, hotel_room } = hotel;

    return new HotelEntity(
      id_hotel,
      name,
      category as HotelCategory,
      address ?? undefined,
      hotel_room ? hotel_room.map(HotelRoomEntity.fromObject) : undefined,
      distrit ? DistritEntity.fromObject(distrit) : undefined
    );
  }
}
