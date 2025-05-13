import type { IHotelRoomTripDetailsModel } from "@/infrastructure/models";
import { HotelRoomEntity } from "./hotelRoom.entity";
import { TripDetailsEntity } from "./tripDetails.entity";

export class HotelRoomTripDetailsEntity {
  constructor(
    public readonly id: number,
    public readonly costPerson: number,
    public readonly date: Date,
    public readonly hotelRoom?: HotelRoomEntity,
    public readonly tripDetails?: TripDetailsEntity
  ) {}

  public static async fromObject(HotelRoomTripDetails: {
    [key: string]: any;
  }): Promise<HotelRoomTripDetailsEntity> {
    const { id, date, cost_person, hotel_room, trip_details } =
      HotelRoomTripDetails as IHotelRoomTripDetailsModel;
    return new HotelRoomTripDetailsEntity(
      id,
      Number(cost_person),
      date,
      hotel_room ? await HotelRoomEntity.fromObject(hotel_room) : undefined,
      trip_details
        ? await TripDetailsEntity.fromObject(trip_details)
        : undefined
    );
  }
}
