import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { HotelRoomEntity } from "./hotelRoom.entity";
import { hotel, hotel_room } from "@prisma/client";
import { Distrit, DistritEntity } from "./distrit.entity";

export type Hotel = hotel & {
  hotel_room?: hotel_room[];
  distrit?: Distrit;
};

export enum HotelCategory {
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  BOUTIQUE = "BOUTIQUE",
  VILLA = "VILLA",
  LODGE = "LODGE",
}
export class HotelEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly category: HotelCategory,
    private readonly address: string,
    private readonly hotelRooms?: HotelRoomEntity[],
    private readonly distrit?: DistritEntity
  ) {}

  public static fromObject(hotel: Hotel): HotelEntity {
    const {
      id_hotel,
      name,
      category,
      distrit,
      address,

      hotel_room,
    } = hotel;

    const error = Validations.validateEmptyFields(
      {
        id_hotel,
        name,
        category,
        address,
      },
      "HotelEntity"
    );
    if (error) throw CustomError.badRequest(error);

    const errorHotelCategory = Validations.validateEnumValue(
      category,
      Object.values(HotelCategory)
    );
    if (errorHotelCategory) throw CustomError.badRequest(errorHotelCategory);

    return new HotelEntity(
      id_hotel,
      name,
      category as HotelCategory,
      address,
      hotel_room ? hotel_room.map(HotelRoomEntity.fromObject) : undefined,
      distrit ? DistritEntity.fromObject(distrit) : undefined
    );
  }
}
