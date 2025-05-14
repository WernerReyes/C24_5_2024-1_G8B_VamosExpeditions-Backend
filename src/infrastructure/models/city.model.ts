import { Prisma, PrismaClient, type city } from "@prisma/client";
import { Model } from "./model";
import { type ICountryModel } from "./country.model";

export interface ICityModel extends city {
  country?: ICountryModel;
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
    public country?: ICountryModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new CityModel(0, "", 0);
  }

  public static get instance(): CityModel {
    return this._instance;
  }

  public static get partialInstance(): CityModel {
    return new CityModel(
      this._instance.id_city,
      this._instance.name,
      this._instance.country_id
    );
  }

  public static set setCountry(country: ICountryModel) {
    this._instance.country = country;
  }

  public static getString() {
    return this._instance.getString();
  }
}
