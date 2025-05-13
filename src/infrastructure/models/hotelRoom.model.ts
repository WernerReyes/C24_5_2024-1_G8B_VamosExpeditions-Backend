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
  private static _instance: HotelRoomModel = new HotelRoomModel(
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

  public static get instance(): HotelRoomModel {
    return this._instance;
  }

  public static set setHotel(hotel: IHotelModel) {
    this._instance.hotel = hotel;
  }

  public static get getString() {
    return this._instance.getString();
  }
}
