import { Prisma, PrismaClient, type user } from "@prisma/client";
import { Model } from "./model";
import { type IRoleModel, RoleModel } from "./role.model";
import { ISettingModel } from "./setting.model";

export interface IUserModel extends user {
  role?: IRoleModel;
  settings?: ISettingModel[];
  settings_settings_user_idTouser?: ISettingModel[];
}

export class UserModel extends Model<IUserModel> implements IUserModel {
  private static user = new PrismaClient().user;

  public static modelName = Prisma.ModelName.user;

  private static _instance: UserModel;

  protected override get getEmpty(): UserModel {
    return UserModel._instance;
  }

  private constructor(
    public readonly id_user: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly is_deleted: boolean,
    public readonly description: string | null,
    public readonly phone_number: string | null,
    public readonly id_role: number,
    public readonly deleted_at: Date | null,
    public readonly delete_reason: string | null,
    public readonly twofasecret: string | null,
    public role?: RoleModel,
    public settings?: ISettingModel[],
    public settings_settings_user_idTouser?: ISettingModel[]
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new UserModel(
      0,
      "",
      "",
      "",
      new Date(0),
      new Date(0),
      false,
      null,
      null,
      0,
      null,
      null,
      null
    );
  }

  public static get instance(): UserModel {
    return this._instance;
  }

  public static get partialInstance(): UserModel {
    return new UserModel(
      this._instance.id_user,
      this._instance.fullname,
      this._instance.email,
      this._instance.password,
      this._instance.created_at,
      this._instance.updated_at,
      this._instance.is_deleted,
      this._instance.description,
      this._instance.phone_number,
      this._instance.id_role,
      this._instance.deleted_at,
      this._instance.delete_reason,
      this._instance.twofasecret
    );
  }

  public static set setRole(role: RoleModel) {
    this._instance.role = role;
  }

  public static set setRelationship(relationship: Pick<IUserModel, "role"| "settings" | "settings_settings_user_idTouser">) {
    Object.assign(this._instance, relationship);
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.userFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.userFindManyArgs>
  ): Promise<Prisma.userGetPayload<T>[]> {
    return await this.user.findMany(args);
  }

  public static async findFirst<T extends Prisma.userFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.userFindFirstArgs>
  ): Promise<Prisma.userGetPayload<T> | null> {
    return await this.user.findFirst(args);
  }

  public static async findUnique<T extends Prisma.userFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.userFindUniqueArgs>
  ): Promise<Prisma.userGetPayload<T> | null> {
    return await this.user.findUnique(args);
  }

  public static async create<T extends Prisma.userCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.userCreateArgs>
  ): Promise<Prisma.userGetPayload<T>> {
    return await this.user.create(args);
  }
  public static async createMany<T extends Prisma.userCreateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.userCreateManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.user.createMany(args);
  }

  public static async update<T extends Prisma.userUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.userUpdateArgs>
  ): Promise<Prisma.userGetPayload<T>> {
    return await this.user.update(args);
  }

  public static async delete<T extends Prisma.userDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.userDeleteArgs>
  ): Promise<Prisma.userGetPayload<T>> {
    return await this.user.delete(args);
  }
  public static async count<T extends Prisma.userCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.userCountArgs>
  ): Promise<number> {
    const result = await this.user.count(args);
    return typeof result === "number" ? result : 0;
  }
  
}
