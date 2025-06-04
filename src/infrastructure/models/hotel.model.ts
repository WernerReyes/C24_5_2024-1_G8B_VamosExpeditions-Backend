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

  private static _instance: HotelModel;

  protected override get getEmpty(): HotelModel {
    return HotelModel._instance;
  }
  constructor(
    public readonly id_hotel: number,
    public readonly name: string,
    public readonly distrit_id: number,
    public readonly category: string,
    public readonly address: string | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly deleted_at: Date | null = null,
    public readonly  is_deleted: boolean = false,
    public readonly delete_reason: string | null = null,

    public hotel_room: IHotelRoomModel[] = [],
    public distrit?: IDistrictModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new HotelModel(0, "", 0, "", null, new Date(), new Date());
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
      this._instance.created_at,
      this._instance.updated_at
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

  public static async findUnique<T extends Prisma.hotelFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotelFindUniqueArgs>
  ): Promise<Prisma.hotelGetPayload<T> | null> {
    return await this.hotel.findUnique(args);
  }

  public static async findMany<T extends Prisma.hotelFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotelFindManyArgs>
  ): Promise<Prisma.hotelGetPayload<T>[]> {
    return await this.hotel.findMany(args);
  }

  public static async create<T extends Prisma.hotelCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotelCreateArgs>
  ): Promise<Prisma.hotelGetPayload<T>> {
    return await this.hotel.create(args);
  }

  public static async update<T extends Prisma.hotelUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.hotelUpdateArgs>
  ): Promise<Prisma.hotelGetPayload<T>> {
    return await this.hotel.update(args);
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
