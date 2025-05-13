import { role_type, type role } from "@prisma/client";
import { Model } from "./model";

export interface IRoleModel extends role {}

export class RoleModel extends Model<IRoleModel> implements IRoleModel {
  private static _instance: RoleModel = new RoleModel(0, "" as role_type);

  protected override get getEmpty(): RoleModel {
    return RoleModel._instance;
  }

  constructor(
    public readonly id_role: number,
    public readonly name: role_type
  ) {
    super();
  }

  public static get instance(): RoleModel {
    return this._instance;
  }

  public static getString() {
    return this._instance.getString();
  }
}

export { role_type as RoleEnum };
