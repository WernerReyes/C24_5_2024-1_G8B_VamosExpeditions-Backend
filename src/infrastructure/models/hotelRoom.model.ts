import { hotel_room, Prisma } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import { type IHotelModel } from "./hotel.model";
import { Model, prisma } from "./model";

export interface IHotelRoomModel extends hotel_room {
  hotel?: IHotelModel;
}

export class HotelRoomModel
  extends Model<IHotelRoomModel>
  implements IHotelRoomModel
{
  private static _instance: HotelRoomModel;

  private static hotelRoom = prisma.hotel_room;

  protected override get getEmpty(): HotelRoomModel {
    return HotelRoomModel._instance;
  }

  constructor(
    public readonly id_hotel_room: number,
    public readonly room_type: string,
    public readonly season_type: string | null,
    public readonly price_usd: Decimal | null,
    public readonly service_tax: Decimal | null,
    public readonly rate_usd: Decimal | null,
    public readonly price_pen: Decimal | null,
    public readonly capacity: number,
    public readonly hotel_id: number,
     public readonly deleted_at: Date | null,
    public readonly is_deleted: boolean ,
    public readonly delete_reason: string | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,

    public hotel?: IHotelModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new HotelRoomModel(
      0,
      "",
      null,
      null,
      null,
      null,
      null,
      0,
      0,
      null,
      false,
      null,
      new Date(),
      new Date()
    );
  }

  public static get instance(): HotelRoomModel {
    return this._instance;
  }

  public static get partialInstance(): HotelRoomModel {
    return new HotelRoomModel(
      this._instance.id_hotel_room,
      this._instance.room_type,
      this._instance.season_type,
      this._instance.price_usd,
      this._instance.service_tax,
      this._instance.rate_usd,
      this._instance.price_pen,
      this._instance.capacity,
      this._instance.hotel_id,
      this._instance.deleted_at,
      this._instance.is_deleted,
      this._instance.delete_reason,
      this._instance.created_at,
      this._instance.updated_at
    );
  }

  public static set setHotel(hotel: IHotelModel) {
    this._instance.hotel = hotel;
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static findUnique<T extends Prisma.hotel_roomFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotel_roomFindUniqueArgs>
  ): Promise<Prisma.hotel_roomGetPayload<T> | null> {
    return this.hotelRoom.findUnique(args);
  }

  public static findMany<T extends Prisma.hotel_roomFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotel_roomFindManyArgs>
  ): Promise<Prisma.hotel_roomGetPayload<T>[]> {
    return this.hotelRoom.findMany(args);
  }

  public static create<T extends Prisma.hotel_roomCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotel_roomCreateArgs>
  ): Promise<Prisma.hotel_roomGetPayload<T>> {
    return this.hotelRoom.create(args);
  }

  public static update<T extends Prisma.hotel_roomUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotel_roomUpdateArgs>
  ): Promise<Prisma.hotel_roomGetPayload<T>> {
    return this.hotelRoom.update(args);
  }
}
