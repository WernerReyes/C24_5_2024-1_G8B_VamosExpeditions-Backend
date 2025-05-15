import { Prisma, role_type, type role } from "@prisma/client";
import { Model, prisma } from "./model";

export interface IRoleModel extends role {}

export class RoleModel extends Model<IRoleModel> implements IRoleModel {
  private static _instance: RoleModel;

  public static modelName = Prisma.ModelName.role;

  public static role = prisma.role;

  protected override get getEmpty(): RoleModel {
    return RoleModel._instance;
  }

  constructor(
    public readonly id_role: number,
    public readonly name: role_type,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly is_deleted: boolean,
    public readonly deleted_at: Date | null,
    public readonly delete_reason: string | null
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new RoleModel(
      0,
      role_type.EMPLOYEE_ROLE,
      new Date(0),
      new Date(0),
      false,
      null,
      null
    );
  }

  public static get instance(): RoleModel {
    return this._instance;
  }

  public static get partialInstance(): RoleModel {
    return new RoleModel(
      this._instance.id_role,
      this._instance.name,
      this._instance.created_at,
      this._instance.updated_at,
      this._instance.is_deleted,
      this._instance.deleted_at,
      this._instance.delete_reason
    );
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.roleFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.roleFindManyArgs>
  ): Promise<Prisma.roleGetPayload<T>[]> {
    return await this.role.findMany(args);
  }

  public static async count<T extends Prisma.roleCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.roleCountArgs>
  ): Promise<number> {
    const count = await this.role.count(args);
    return typeof count === "number" ? count : 0;
  }
}

export { role_type as RoleEnum };
