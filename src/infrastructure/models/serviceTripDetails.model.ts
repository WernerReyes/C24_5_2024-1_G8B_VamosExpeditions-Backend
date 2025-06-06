import { Prisma, type service_trip_details } from "@prisma/client";
import { Model, prisma } from "./model";
import { Decimal } from "@prisma/client/runtime/library";
import type { IServiceModel } from "./service.model";
import type { ITripDetailsModel } from "./tripDetails.model";

export interface IServiceTripDetailsModel extends service_trip_details {
  service?: IServiceModel;
  trip_details?: ITripDetailsModel;
}

export class ServiceTripDetailsModel
  extends Model<IServiceTripDetailsModel>
  implements IServiceTripDetailsModel
{
  private static _instance: ServiceTripDetailsModel;

  public static modelName = Prisma.ModelName.service_trip_details;

  public static serviceTripDetails = prisma.service_trip_details;

  protected override get getEmpty(): ServiceTripDetailsModel {
    return ServiceTripDetailsModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly trip_details_id: number,
    public readonly service_id: number,
    public readonly date: Date,
    public readonly cost_person: Decimal,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly service?: IServiceModel,
    public readonly trip_details?: ITripDetailsModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new ServiceTripDetailsModel(
      0,
      0,
      0,
      new Date(),
      Decimal(0),
      new Date(),
      new Date()
    );
  }

  public static get instance(): ServiceTripDetailsModel {
    return this._instance;
  }

  public static get partialInstance(): ServiceTripDetailsModel {
    return new ServiceTripDetailsModel(
      this._instance.id,
      this._instance.trip_details_id,
      this._instance.service_id,
      this._instance.date,
      this._instance.cost_person,
      this._instance.created_at,
      this._instance.updated_at
    );
  }

  public static async findMany<
    T extends Prisma.service_trip_detailsFindManyArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.service_trip_detailsFindManyArgs>
  ): Promise<Prisma.service_trip_detailsGetPayload<T>[]> {
    return await this.serviceTripDetails.findMany(args);
  }

  public static async createManyAndReturn<
    T extends Prisma.service_trip_detailsCreateManyAndReturnArgs
  >(
    args: Prisma.SelectSubset<
      T,
      Prisma.service_trip_detailsCreateManyAndReturnArgs
    >
  ): Promise<Prisma.service_trip_detailsGetPayload<T>[]> {
    return await this.serviceTripDetails.createManyAndReturn(args);
  }

  public static async update<T extends Prisma.service_trip_detailsUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.service_trip_detailsUpdateArgs>
  ): Promise<Prisma.service_trip_detailsGetPayload<T>> {
    return await this.serviceTripDetails.update(args);
  }

  public static async delete<T extends Prisma.service_trip_detailsDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.service_trip_detailsDeleteArgs>
  ): Promise<Prisma.service_trip_detailsGetPayload<T>> {
    return await this.serviceTripDetails.delete(args);
  }

  public static async deleteMany<
    T extends Prisma.service_trip_detailsDeleteManyArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.service_trip_detailsDeleteManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.serviceTripDetails.deleteMany(args);
  }
}
