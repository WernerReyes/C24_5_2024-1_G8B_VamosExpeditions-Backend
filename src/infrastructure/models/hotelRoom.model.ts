import { hotel_room } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import { type IHotelModel } from "./hotel.model";
import { Model } from "./model";

export interface IHotelRoomModel extends hotel_room {
  hotel?: IHotelModel;
}

export class HotelRoomModel
  extends Model<IHotelRoomModel>
  implements IHotelRoomModel
{
  private static _instance: HotelRoomModel
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
      0
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
      this._instance.hotel_id
    );
  }

  public static set setHotel(hotel: IHotelModel) {
    this._instance.hotel = hotel;
  }

  public static get getString() {
    return this._instance.getString();
  }
}
