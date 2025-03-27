import { Validations } from "@/core/utils";
import type {
  client,
  trip_details,
  trip_details_has_city,
} from "@prisma/client";
import { CustomError } from "../error";
import { City, CityEntity } from "./city.entity";
import { Client, ClientEntity } from "./client.entity";
import {
  VersionQuotationEntity,
  type VersionQuotation,
} from "./versionQuotation.entity";
import {
  type HotelRoomTripDetails,
  HotelRoomTripDetailsEntity,
} from "./hotelRoomTripDetails.entity";

export type TripDetails = trip_details & {
  reservation?: any;
  client?: Client;
  version_quotation?: VersionQuotation;
  hotel_room_trip_details?: HotelRoomTripDetails[];
  trip_details_has_city?: (trip_details_has_city & {
    city?: City;
  })[];
};

export enum TravelerStyle {
  STANDARD = "STANDARD",
  COMFORT = "COMFORT",
  LUXUS = "LUXUS",
}

export enum OrderType {
  DIRECT = "DIRECT",
  INDIRECT = "INDIRECT",
}

export class TripDetailsEntity {
  constructor(
    public readonly id: number,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly travelerStyle: TravelerStyle,
    public readonly orderType: OrderType,
    public readonly client?: ClientEntity,
    public readonly cities?: CityEntity[],
    public readonly versionQuotation?: VersionQuotationEntity,
    public readonly hotelRoomTripDetails?: HotelRoomTripDetailsEntity[],
    public readonly specialSpecifications?: string
  ) {}

  public static fromObject(tripDetails: TripDetails): TripDetailsEntity {
    const {
      id,
      trip_details_has_city,
      client,
      number_of_people,
      start_date,
      end_date,
      code,
      traveler_style,
      order_type,
      additional_specifications,
      version_quotation,
    } = tripDetails;

    // Crear y retornar la entidad de reserva
    return new TripDetailsEntity(
      +id,
      +number_of_people,
      new Date(start_date),
      new Date(end_date),
      code,
      traveler_style as TravelerStyle,
      order_type as OrderType,
      client ? ClientEntity.fromObject(client) : undefined,
      trip_details_has_city
        ? trip_details_has_city
            .map((city) =>
              city.city ? CityEntity.fromObject(city.city) : undefined
            )
            .filter((city): city is CityEntity => city !== undefined)
        : undefined,
      version_quotation
        ? VersionQuotationEntity.fromObject(version_quotation)
        : undefined,
      tripDetails.hotel_room_trip_details
        ? tripDetails.hotel_room_trip_details.map((hotel) =>
            HotelRoomTripDetailsEntity.fromObject(hotel)
          )
        : undefined,
      additional_specifications || undefined
    );
  }
}
