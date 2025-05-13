import { Prisma, type hotel_room_trip_details } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { type IHotelRoomModel } from "./hotelRoom.model";
import { Model, prisma } from "./model";
import { type ITripDetailsModel } from "./tripDetails.model";

export interface IHotelRoomTripDetailsModel extends hotel_room_trip_details {
  hotel_room?: IHotelRoomModel;
  trip_details?: ITripDetailsModel;
}

export class HotelRoomTripDetailsModel
  extends Model<IHotelRoomTripDetailsModel>
  implements IHotelRoomTripDetailsModel
{
  public static hotel_room_trip_details = prisma.hotel_room_trip_details;

  public static modelName = Prisma.ModelName.hotel_room_trip_details;

  private static _instance: HotelRoomTripDetailsModel =
    new HotelRoomTripDetailsModel(0, 0, new Date(0), 0, new Decimal(0));

  protected override get getEmpty(): HotelRoomTripDetailsModel {
    return HotelRoomTripDetailsModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly hotel_room_id: number,
    public readonly date: Date,
    public readonly trip_details_id: number,
    public readonly cost_person: Decimal,
    public hotel_room?: IHotelRoomModel,
    public trip_details?: ITripDetailsModel
  ) {
    super();
  }

  public static get instance(): HotelRoomTripDetailsModel {
    return this._instance;
  }

  public static set setHotelRoom(hotelRoom: IHotelRoomModel) {
    this._instance.hotel_room = hotelRoom;
  }

  public static set setTripDetails(tripDetails: ITripDetailsModel) {
    this._instance.trip_details = tripDetails;
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static async findMany<
    T extends Prisma.hotel_room_trip_detailsFindManyArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.hotel_room_trip_detailsFindManyArgs>
  ): Promise<Prisma.hotel_room_trip_detailsGetPayload<T>[]> {
    return await this.hotel_room_trip_details.findMany(args);
  }

  public static async findUnique<
    T extends Prisma.hotel_room_trip_detailsFindUniqueArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.hotel_room_trip_detailsFindUniqueArgs>
  ): Promise<Prisma.hotel_room_trip_detailsGetPayload<T> | null> {
    return await this.hotel_room_trip_details.findUnique(args);
  }

  public static async createManyAndReturn<
    T extends Prisma.hotel_room_trip_detailsCreateManyAndReturnArgs
  >(
    args: Prisma.SelectSubset<
      T,
      Prisma.hotel_room_trip_detailsCreateManyAndReturnArgs
    >
  ): Promise<Prisma.hotel_room_trip_detailsGetPayload<T>[]> {
    return await this.hotel_room_trip_details.createManyAndReturn(args);
  }

  public static async update<
    T extends Prisma.hotel_room_trip_detailsUpdateArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.hotel_room_trip_detailsUpdateArgs>
  ): Promise<Prisma.hotel_room_trip_detailsGetPayload<T>> {
    return await this.hotel_room_trip_details.update(args);
  }

  public static async delete<
    T extends Prisma.hotel_room_trip_detailsDeleteArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.hotel_room_trip_detailsDeleteArgs>
  ): Promise<Prisma.hotel_room_trip_detailsGetPayload<T>> {
    return await this.hotel_room_trip_details.delete(args);
  }

  public static async deleteMany<
    T extends Prisma.hotel_room_trip_detailsDeleteManyArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.hotel_room_trip_detailsDeleteManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.hotel_room_trip_details.deleteMany(args);
  }
}
