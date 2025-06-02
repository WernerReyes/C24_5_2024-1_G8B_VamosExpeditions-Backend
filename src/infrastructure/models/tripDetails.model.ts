import {
  Prisma,
  type trip_details,
  trip_details_order_type,
  trip_details_traveler_style,
} from "@prisma/client";
import { IClientModel } from "./client.model";
import { type IHotelRoomTripDetailsModel } from "./hotelRoomTripDetails.model";
import { Model, prisma } from "./model";
import { type ITripDetailsHasCityModel } from "./tripDetailsHasCity.model";
import { type IVersionQuotationModel } from "./versionQuotation.model";
import { type IServiceTripDetailsModel } from "./serviceTripDetails.model";

export interface ITripDetailsModel extends trip_details {
  client?: IClientModel;
  version_quotation?: IVersionQuotationModel;
  hotel_room_trip_details?: IHotelRoomTripDetailsModel[];
  service_trip_details?: IServiceTripDetailsModel[];
  trip_details_has_city?: ITripDetailsHasCityModel[];
}

export class TripDetailsModel
  extends Model<ITripDetailsModel>
  implements ITripDetailsModel
{
  private static trip_details = prisma.trip_details;

  private static _instance: TripDetailsModel

  protected override get getEmpty(): TripDetailsModel {
    return TripDetailsModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly version_number: number,
    public readonly quotation_id: number,
    public readonly start_date: Date,
    public readonly end_date: Date,
    public readonly number_of_people: number,
    public readonly traveler_style: trip_details_traveler_style,
    public readonly code: string,
    public readonly order_type: trip_details_order_type,
    public readonly additional_specifications: string | null,
    public readonly client_id: number,
    public client?: IClientModel,
    public version_quotation?: IVersionQuotationModel,
    public hotel_room_trip_details?: IHotelRoomTripDetailsModel[],
    public trip_details_has_city?: ITripDetailsHasCityModel[]
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new TripDetailsModel(
      0,
      0,
      0,
      new Date(0),
      new Date(0),
      0,
      "" as trip_details_traveler_style,
      "",
      "" as trip_details_order_type,
      null,
      0
    );
  }

  public static get instance(): TripDetailsModel {
    return this._instance;
  }

  public static get partialInstance(): TripDetailsModel {
    return new TripDetailsModel(
      this._instance.id,
      this._instance.version_number,
      this._instance.quotation_id,
      this._instance.start_date,
      this._instance.end_date,
      this._instance.number_of_people,
      this._instance.traveler_style,
      this._instance.code,
      this._instance.order_type,
      this._instance.additional_specifications,
      this._instance.client_id
    );
  }

  public static set setClient(client: IClientModel) {
    this._instance.client = client;
  }

  public static set setVersionQuotation(
    versionQuotation: IVersionQuotationModel
  ) {
    this._instance.version_quotation = versionQuotation;
  }

  public static set setHotelRoomTripDetails(
    hotelRoomTripDetails: IHotelRoomTripDetailsModel[]
  ) {
    this._instance.hotel_room_trip_details = hotelRoomTripDetails;
  }

  public static set setTripDetailsHasCity(
    tripDetailsHasCity: ITripDetailsHasCityModel[]
  ) {
    this._instance.trip_details_has_city = tripDetailsHasCity;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static async findUnique<T extends Prisma.trip_detailsFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.trip_detailsFindUniqueArgs>
  ): Promise<Prisma.trip_detailsGetPayload<T> | null> {
    return await this.trip_details.findUnique(args);
  }

  public static async upsert<T extends Prisma.trip_detailsUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.trip_detailsUpsertArgs>
  ): Promise<Prisma.trip_detailsGetPayload<T>> {
    return await this.trip_details.upsert(args);
  }
}

export {
  trip_details_order_type as TripDetailsOrderTypeEnum,
  trip_details_traveler_style as TripDetailsTravelerStyleEnum,
};
