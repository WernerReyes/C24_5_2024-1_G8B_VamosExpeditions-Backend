import {
  type ITripDetailsModel,
  type TripDetailsOrderTypeEnum,
  type TripDetailsTravelerStyleEnum,
} from "@/infrastructure/models";
import { CityEntity } from "./city.entity";
import { ClientEntity } from "./client.entity";
import {
  HotelRoomTripDetailsEntity
} from "./hotelRoomTripDetails.entity";
import {
  VersionQuotationEntity
} from "./versionQuotation.entity";

export class TripDetailsEntity {
  constructor(
    public readonly id: number,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly travelerStyle: TripDetailsTravelerStyleEnum,
    public readonly orderType: TripDetailsOrderTypeEnum,
    public readonly client?: ClientEntity,
    public readonly cities?: CityEntity[],
    public readonly versionQuotation?: VersionQuotationEntity,
    public readonly hotelRoomTripDetails?: HotelRoomTripDetailsEntity[],
    public readonly specialSpecifications?: string
  ) {}

  public static async fromObject(tripDetails: {
    [key: string]: any;
  }): Promise<TripDetailsEntity> {
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
      hotel_room_trip_details,
    } = tripDetails as ITripDetailsModel;

    // Crear y retornar la entidad de reserva
    return new TripDetailsEntity(
      +id,
      +number_of_people,
      new Date(start_date),
      new Date(end_date),
      code,
      traveler_style,
      order_type,
      client ? await ClientEntity.fromObject(client) : undefined,
      trip_details_has_city
        ? await Promise.all(
            trip_details_has_city.map(async (city) =>
              city.city ? await CityEntity.fromObject(city.city) : undefined
            )
          ).then((cities) =>
            cities.filter((city): city is CityEntity => city !== undefined)
          )
        : undefined,
      version_quotation
        ? await VersionQuotationEntity.fromObject(version_quotation)
        : undefined,
      hotel_room_trip_details
        ? await Promise.all(
            hotel_room_trip_details.map((hotel) =>
              HotelRoomTripDetailsEntity.fromObject(hotel)
            )
          )
        : undefined,
      additional_specifications || undefined
    );
  }
}
