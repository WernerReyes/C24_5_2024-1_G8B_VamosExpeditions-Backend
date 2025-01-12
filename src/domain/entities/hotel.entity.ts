import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { HotelRoomEntity } from "./hotelRoom.entity";

export class HotelEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly category: string,
    private readonly address: string,
    private readonly rating: number,
    private readonly email: string,
    private readonly hotelRoom: HotelRoomEntity[]
  ) {}

  public static fromObject(object: { [key: string]: any }): HotelEntity {
    const {
      id_accommodation,
      name,
      category,
      address,
      rating,
      email,
      accommodation_room,
    } = object;

    const error = Validations.validateEmptyFields({
      id_accommodation,
      name,
      category,
      address,
      rating,
      email,
    });
    if (error) throw CustomError.badRequest(error);

    return new HotelEntity(
      object.id,
      object.name,
      object.category,
      object.address,
      object.rating,
      object.email,

      accommodation_room
        ? accommodation_room.map((hotel: HotelRoomEntity) =>
            HotelRoomEntity.fromJson(hotel)
          )
        : undefined
    );
  }
}
