import { Prisma, trip_details_has_city } from "@prisma/client";
import { Model, prisma } from "./model";
import type { ICityModel } from "./city.model";

export interface ITripDetailsHasCityModel extends trip_details_has_city {
  city?: ICityModel;
}

export class TripDetailsHasCityModel
  extends Model<ITripDetailsHasCityModel>
  implements ITripDetailsHasCityModel
{
  private static trip_details_has_city = prisma.trip_details_has_city;

  private static _instance: TripDetailsHasCityModel

  protected override get getEmpty(): TripDetailsHasCityModel {
    return TripDetailsHasCityModel._instance;
  }
  constructor(
    public readonly trip_details_id: number,
    public readonly city_id: number,
    public city?: ICityModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new TripDetailsHasCityModel(0, 0);
  }

  public static get instance(): TripDetailsHasCityModel {
    return this._instance;
  }

  public static get partialInstance(): TripDetailsHasCityModel {
    return new TripDetailsHasCityModel(
      this._instance.trip_details_id,
      this._instance.city_id
    );
  }

  public static set setCity(city: ICityModel) {
    this._instance.city = city;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static async deleteMany<
    T extends Prisma.trip_details_has_cityDeleteManyArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.trip_details_has_cityDeleteManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.trip_details_has_city.deleteMany(args);
  }
}
