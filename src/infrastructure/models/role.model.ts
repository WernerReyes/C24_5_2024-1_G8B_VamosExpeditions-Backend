import { role_type, type role } from "@prisma/client";
import { Model } from "./model";

export interface IRoleModel extends role {}

export class RoleModel extends Model<IRoleModel> implements IRoleModel {
  private static _instance: RoleModel

  protected override get getEmpty(): RoleModel {
    return RoleModel._instance;
  }

  constructor(
    public readonly id_role: number,
    public readonly name: role_type
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new RoleModel(0, role_type.EMPLOYEE_ROLE);
  }

  public static get instance(): RoleModel {
    return this._instance;
  }

  public static get partialInstance(): RoleModel {
    return new RoleModel(this._instance.id_role, this._instance.name);
  }

  public static getString() {
    return this._instance.getString();
  }
}

export { role_type as RoleEnum };
