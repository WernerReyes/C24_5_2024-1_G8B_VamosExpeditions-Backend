import { Prisma, type service } from "@prisma/client";
import { Model, prisma } from "./model";
import type { Decimal } from "@prisma/client/runtime/library";
import type { IDistrictModel } from "./district.model";
import type { IServiceTypeModel } from "./serviceType.model";
import type { IServiceTripDetailsModel } from "./serviceTripDetails.model";

export interface IServiceModel extends service {
  distrit?: IDistrictModel;
  service_type?: IServiceTypeModel;
  service_trip_details?: IServiceTripDetailsModel[];
}

export class ServiceModel
  extends Model<IServiceModel>
  implements IServiceModel
{
  private static _instance: ServiceModel;

  public static modelName = Prisma.ModelName.service;

  public static service = prisma.service;

  protected override get getEmpty(): ServiceModel {
    return ServiceModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly service_type_id: number,
    public readonly description: string,
    public readonly duration: string | null,
    public readonly passengers_min: number | null,
    public readonly passengers_max: number | null,
    public readonly price_usd: Decimal | null,
    public readonly tax_igv_usd: Decimal | null,
    public readonly rate_usd: Decimal | null,
    public readonly price_pen: Decimal | null,
    public readonly tax_igv_pen: Decimal | null,
    public readonly rate_pen: Decimal | null,
    public readonly distrit_id: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public distrit?: IDistrictModel,
    public service_type?: IServiceTypeModel,
    public service_trip_details?: IServiceTripDetailsModel[]
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new ServiceModel(
      0,
      0,
      "",
      "",
      0,
      0,
      null,
      null,
      null,
      null,
      null,
      null,
      0,
      new Date(),
      new Date()
    );
  }

  public static get instance(): ServiceModel {
    return this._instance;
  }

  public static get partialInstance(): ServiceModel {
    return new ServiceModel(
      this._instance.id,
      this._instance.service_type_id,
      this._instance.description,
      this._instance.duration,
      this._instance.passengers_min,
      this._instance.passengers_max,
      this._instance.price_usd,
      this._instance.tax_igv_usd,
      this._instance.rate_usd,
      this._instance.price_pen,
      this._instance.tax_igv_pen,
      this._instance.rate_pen,
      this._instance.distrit_id,
      this._instance.created_at,
      this._instance.updated_at
    );
  }

  public static set setDistrict(distrit: IDistrictModel) {
    this._instance.distrit = distrit;
  }

  public static set setServiceType(service_type: IServiceTypeModel) {
    this._instance.service_type = service_type;
  }

  public static set setServiceTripDetails(
    service_trip_details: IServiceTripDetailsModel[]
  ) {
    this._instance.service_trip_details = service_trip_details;
  }

  public static set setRelationship(
    relationship: Pick<
      IServiceModel,
      "distrit" | "service_type" | "service_trip_details"
    >
  ) {
    Object.assign(this._instance, relationship);
  }
  public static get getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.serviceFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.serviceFindManyArgs>
  ): Promise<Prisma.serviceGetPayload<T>[]> {
    return await this.service.findMany(args);
  }

  public static async count<T extends Prisma.serviceCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.serviceCountArgs>
  ): Promise<number> {
    const result = await this.service.count(args);
    return typeof result === "number" ? result : 0;
  }

  public static async findUnique<T extends Prisma.serviceFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.serviceFindUniqueArgs>
  ): Promise<Prisma.serviceGetPayload<T> | null> {
    return await this.service.findUnique(args);
  }

  public static async create<T extends Prisma.serviceCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.serviceCreateArgs>
  ): Promise<Prisma.serviceGetPayload<T>> {
    return await this.service.create(args);
  }

  public static async createMany<T extends Prisma.serviceCreateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.serviceCreateManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.service.createMany(args);
  }

  public static async update<T extends Prisma.serviceUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.serviceUpdateArgs>
  ): Promise<Prisma.serviceGetPayload<T>> {
    return await this.service.update(args);
  }
}
