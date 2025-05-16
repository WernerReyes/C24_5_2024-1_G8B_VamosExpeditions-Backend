import { Prisma, PrismaClient, type city } from "@prisma/client";
import { Model } from "./model";
import { type ICountryModel } from "./country.model";
import { IDistrictModel } from "./district.model";

export interface ICityModel extends city {
  country?: ICountryModel;
  distrit?: IDistrictModel[];
}

export class CityModel extends Model<ICityModel> implements ICityModel {
  private static city = new PrismaClient().city;

  public static modelName = Prisma.ModelName.city;

  private static _instance: CityModel

  protected override get getEmpty(): CityModel {
    return CityModel._instance;
  }

  constructor(
    public readonly id_city: number,
    public readonly name: string,
    public readonly country_id: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public country?: ICountryModel,
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new CityModel(0, "", 0, new Date(), new Date());
  }

  public static get instance(): CityModel {
    return this._instance;
  }

  public static get partialInstance(): CityModel {
    return new CityModel(
      this._instance.id_city,
      this._instance.name,
      this._instance.country_id,
      this._instance.created_at,
      this._instance.updated_at,
    );
  }

  public static set setCountry(country: ICountryModel) {
    this._instance.country = country;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static findUnique<T extends Prisma.cityFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.cityFindUniqueArgs>
  ): Promise<Prisma.cityGetPayload<T> | null> {
    return this.city.findUnique(args)
  }

  public static findMany<T extends Prisma.cityFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.cityFindManyArgs>
  ): Promise<Prisma.cityGetPayload<T>[]> {
    return this.city.findMany(args)
  }

  public static async create<T extends Prisma.cityCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.cityCreateArgs>
  ): Promise<Prisma.cityGetPayload<T>> {
    return await this.city.create(args);
  }

  public static async update<T extends Prisma.cityUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.cityUpdateArgs>
  ): Promise<Prisma.cityGetPayload<T>> {
    return await this.city.update(args);
  }
}
