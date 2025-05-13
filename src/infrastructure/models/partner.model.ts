import { type partner } from "@prisma/client";
import { Model } from "./model";

export interface IPartnerModel extends partner {}

export class PartnerModel extends Model<IPartnerModel> implements IPartnerModel {
  private static _instance: PartnerModel = new PartnerModel(0, "", new Date());

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

  public static get instance(): PartnerModel {
    return this._instance;
  }

  static getEmpty(): PartnerModel {
    return this._instance;
  }
}
