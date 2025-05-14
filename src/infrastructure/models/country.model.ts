import { Prisma, type country, PrismaClient } from "@prisma/client";
import { type ICityModel } from "./city.model";
import { Model } from "./model";

export interface ICountryModel extends country {
  city?: ICityModel[];
}

export class CountryModel
  extends Model<ICountryModel>
  implements ICountryModel
{
  private static country = new PrismaClient().country;

  private static _instance: CountryModel

  protected override get getEmpty(): CountryModel {
    return CountryModel._instance;
  }

  constructor(
    public readonly id_country: number,
    public readonly name: string,
    public readonly code: string,
    public city?: ICityModel[]
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new CountryModel(0, "", "", []);
  }

  public static get instance(): CountryModel {
    return this._instance;
  }

  public static get partialInstance(): CountryModel {
    return new CountryModel(
      this._instance.id_country,
      this._instance.name,
      this._instance.code,
      this._instance.city
    );
  }

  public static set setCities(cities: ICityModel[]) {
    this._instance.city = cities;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.countryFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.countryFindManyArgs>
  ): Promise<Prisma.countryGetPayload<T>[]> {
    return await this.country.findMany(args);
  }
}
