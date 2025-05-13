import { Prisma, PrismaClient, type user } from "@prisma/client";
import { Model } from "./model";
import { type IRoleModel, RoleModel } from "./role.model";


export interface IUserModel extends user {
  role?: IRoleModel;
}

export class UserModel extends Model<IUserModel> implements IUserModel {
  private static user = new PrismaClient().user;

  public static modelName = Prisma.ModelName.user;

  private static _instance: UserModel = new UserModel(
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
    null
  );

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
    public role?: RoleModel
  ) {
    super();
  }

  public static get instance(): UserModel {
    return this._instance;
  }

  public static set role(role: RoleModel) {
    this._instance.role = role;
  }

  public static getString() {
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
