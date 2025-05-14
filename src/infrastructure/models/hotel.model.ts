import { Prisma, PrismaClient, type hotel } from "@prisma/client";
import { type IDistrictModel } from "./district.model";
import { type IHotelRoomModel } from "./hotelRoom.model";
import { Model } from "./model";

export interface IHotelModel extends hotel {
  hotel_room?: IHotelRoomModel[];
  distrit?: IDistrictModel;
}

export class HotelModel extends Model<IHotelModel> implements IHotelModel {
  private static hotel = new PrismaClient().hotel;

  private static _instance: HotelModel

  protected override get getEmpty(): HotelModel {
    return HotelModel._instance;
  }
  constructor(
    public readonly id_hotel: number,
    public readonly name: string,
    public readonly distrit_id: number,
    public readonly category: string,
    public readonly address: string | null,
    public hotel_room: IHotelRoomModel[] = [],
    public distrit?: IDistrictModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new HotelModel(0, "", 0, "", null);
  }

  public static get instance(): HotelModel {
    return this._instance;
  }

  public static get partialInstance(): HotelModel {
    return new HotelModel(
      this._instance.id_hotel,
      this._instance.name,
      this._instance.distrit_id,
      this._instance.category,
      this._instance.address,
      this._instance.hotel_room
    );
  }

  public static set setDistrict(district: IDistrictModel) {
    this._instance.distrit = district;
  }

  public static set setHotelRooms(hotelRooms: IHotelRoomModel[]) {
    this._instance.hotel_room = hotelRooms;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.hotelFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotelFindManyArgs>
  ): Promise<Prisma.hotelGetPayload<T>[]> {
    return await this.hotel.findMany(args);
  }

  public static async count<T extends Prisma.hotelCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotelCountArgs>
  ): Promise<number> {
    const result = await this.hotel.count(args);
    return typeof result === "number" ? result : 0;
  }
}

export enum HotelCategory {
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  BOUTIQUE = "BOUTIQUE",
  VILLA = "VILLA",
  LODGE = "LODGE",
}
