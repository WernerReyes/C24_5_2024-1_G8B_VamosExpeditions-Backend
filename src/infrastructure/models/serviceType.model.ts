import { Prisma, type service_type } from "@prisma/client";
import { Model, prisma } from "./model";
import { IServiceModel } from "./service.model";

export interface IServiceTypeModel extends service_type {
  service?: IServiceModel[];
}

export class ServiceTypeModel
  extends Model<IServiceTypeModel>
  implements IServiceTypeModel
{
  private static _instance: ServiceTypeModel;

  public static modelName = Prisma.ModelName.service_type;

  public static serviceType = prisma.service_type;

  protected override get getEmpty(): ServiceTypeModel {
    return ServiceTypeModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public service?: IServiceModel[]
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new ServiceTypeModel(0, "", new Date(), new Date());
  }

  public static get instance(): ServiceTypeModel {
    return this._instance;
  }

  public static get partialInstance(): ServiceTypeModel {
    return new ServiceTypeModel(
      this._instance.id,
      this._instance.name,
      this._instance.created_at,
      this._instance.updated_at
    );
  }
  public static get getString() {
    return this._instance.getString();
  }

  public static set setRelationship(relationship: Pick<IServiceTypeModel, "service">) {
    Object.assign(this._instance, relationship);
  }


}
