import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { HotelRoomEntity } from "./hotelRoom.entity";
import { distrit, hotel, hotel_room } from "@prisma/client";
import { Distrit, DistritEntity } from "./distrit.entity";

export type Hotel = hotel & {
  hotel_room?: hotel_room[];
  distrit?: Distrit;
};

export class HotelEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly category: string,
    private readonly address: string,
    private readonly rating: number,
    private readonly email: string | null,
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
      rating,
      email,
      hotel_room,
    } = hotel;

    const error = Validations.validateEmptyFields(
      {
        id_hotel,
        name,
        category,
        address,
        rating,
      },
      "HotelEntity"
    );
    if (error) throw CustomError.badRequest(error);

    return new HotelEntity(
      id_hotel,
      name,
      category,
      address,
      rating,
      email,
      hotel_room ? hotel_room.map(HotelRoomEntity.fromJson) : undefined,
      distrit ? DistritEntity.fromObject(distrit) : undefined
    );
  }
}
