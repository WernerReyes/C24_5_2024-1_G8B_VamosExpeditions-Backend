import { type partner } from "@prisma/client";
import { Model } from "./model";

export interface IPartnerModel extends partner {}

export class PartnerModel extends Model<IPartnerModel> implements IPartnerModel {
  private static _instance: PartnerModel

  protected override get getEmpty(): PartnerModel {
    return PartnerModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly created_at: Date
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new PartnerModel(0, "", new Date(0));
  }

  public static get instance(): PartnerModel {
    return this._instance;
  }

  public static get partialInstance(): PartnerModel {
    return new PartnerModel(this._instance.id, this._instance.name, this._instance.created_at);
  }

  static getEmpty(): PartnerModel {
    return this._instance;
  }
}
