import { Validations } from "@/core/utils";
import type { hotel_room_trip_details } from "@prisma/client";
import { CustomError } from "../error";
import { HotelRoom, HotelRoomEntity } from "./hotelRoom.entity";
import { TripDetails, TripDetailsEntity } from "./tripDetails.entity";

export type HotelRoomTripDetails = hotel_room_trip_details & {
  hotel_room?: HotelRoom;
  trip_details?: TripDetails;
};

export class HotelRoomTripDetailsEntity {
  constructor(
    public readonly id: number,
    public readonly numberOfPeople: number,
    public readonly date: Date,
    public readonly hotelRoom?: HotelRoomEntity,
    public readonly tripDetails?: TripDetailsEntity
  ) {}

  public static fromObject(
    HotelRoomTripDetails: HotelRoomTripDetails
  ): HotelRoomTripDetailsEntity {
    const { id, date, number_of_people, hotel_room, trip_details } =
      HotelRoomTripDetails;

    return new HotelRoomTripDetailsEntity(
      id,
      number_of_people,
      date,
      hotel_room ? HotelRoomEntity.fromObject(hotel_room) : undefined,
      trip_details ? TripDetailsEntity.fromObject(trip_details) : undefined
    );
  }
}
