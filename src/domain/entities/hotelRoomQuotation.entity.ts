import type { hotel_room_quotation } from "@prisma/client";
import { HotelRoom, HotelRoomEntity } from "./hotelRoom.entity";
import {
  type VersionQuotation,
  VersionQuotationEntity,
} from "./versionQuotation.entity";
import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export type HotelRoomQuotation = hotel_room_quotation & {
  hotel_room?: HotelRoom;
  version_quotation?: VersionQuotation;
};

export class HotelRoomQuotationEntity {
  constructor(
    public readonly id: number,
    public readonly numberOfPeople: number,
    public readonly date: Date,
    public readonly hotelRoom?: HotelRoomEntity,
    public readonly versionQuotation?: VersionQuotationEntity
  ) {}

  public static fromObject(
    hotelRoomQuotation: HotelRoomQuotation
  ): HotelRoomQuotationEntity {
    const { id_hotel_room_quotation,  date, number_of_people, hotel_room, version_quotation } =
      hotelRoomQuotation;

    const error = Validations.validateEmptyFields({
      id_hotel_room_quotation,
      number_of_people,
      date
    });

    if (error) throw CustomError.badRequest(error);

    return new HotelRoomQuotationEntity(
      id_hotel_room_quotation,
      number_of_people,
      date,
      hotel_room ? HotelRoomEntity.fromObject(hotel_room) : undefined,
      version_quotation
        ? VersionQuotationEntity.fromObject(version_quotation)
        : undefined
    );
  }
}
