import type { hotel_room_trip_details } from "@prisma/client";
import { HotelRoom, HotelRoomEntity } from "./hotelRoom.entity";
import { TripDetails, TripDetailsEntity } from "./tripDetails.entity";

export type HotelRoomTripDetails = hotel_room_trip_details & {
  hotel_room?: HotelRoom;
  trip_details?: TripDetails;
};

export class HotelRoomTripDetailsEntity {
  constructor(
    public readonly id: number,
    public readonly costPerson: number,
    public readonly date: Date,
    public readonly hotelRoom?: HotelRoomEntity,
    public readonly tripDetails?: TripDetailsEntity
  ) {}

  public static async fromObject(
    HotelRoomTripDetails: HotelRoomTripDetails
  ): Promise<HotelRoomTripDetailsEntity> {
    const { id, date, cost_person, hotel_room, trip_details } =
      HotelRoomTripDetails;

    return new HotelRoomTripDetailsEntity(
      id,
      Number(cost_person),
      date,
      hotel_room ? await HotelRoomEntity.fromObject(hotel_room) : undefined,
      trip_details ? await TripDetailsEntity.fromObject(trip_details) : undefined
    );
  }
}
