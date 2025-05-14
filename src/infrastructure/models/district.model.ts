import { Prisma, PrismaClient, type distrit } from "@prisma/client";
import { type ICityModel } from "./city.model";
import { Model } from "./model";

export interface IDistrictModel extends distrit {
  city?: ICityModel;
}

export class DistrictModel
  extends Model<IDistrictModel>
  implements IDistrictModel
{
  private static distrit = new PrismaClient().distrit;

  private static _instance: DistrictModel

  protected override get getEmpty(): DistrictModel {
    return DistrictModel._instance;
  }

  constructor(
    public readonly id_distrit: number,
    public readonly name: string,
    public readonly city_id: number,
    public city?: ICityModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new DistrictModel(0, "", 0);
  }

  public static get instance(): DistrictModel {
    return this._instance;
  }

  public static get partialInstance(): DistrictModel {
    return new DistrictModel(
      this._instance.id_distrit,
      this._instance.name,
      this._instance.city_id
    );
  }

  public static set setCity(city: ICityModel) {
    this._instance.city = city;
  }

  public static async findMany<T extends Prisma.distritFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.distritFindManyArgs>
  ): Promise<Prisma.distritGetPayload<T>[]> {
    return await this.distrit.findMany(args);
  }
}
