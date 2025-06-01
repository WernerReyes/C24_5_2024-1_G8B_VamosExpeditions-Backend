import { Prisma, setting_key_enum, type settings } from "@prisma/client";
import { Model, prisma } from "./model";
import type { IUserModel } from "./user.model";

export interface ISettingModel extends settings {
  user?: IUserModel;
  user_settings_user_idTouser?: IUserModel;
}

export class SettingModel
  extends Model<ISettingModel>
  implements ISettingModel
{
  private static _instance: SettingModel;

  public static modelName = Prisma.ModelName.settings;

  public static setting = prisma.settings;

  protected override get getEmpty(): SettingModel {
    return SettingModel._instance;
  }
  constructor(
    public readonly id: number,
    public readonly key: setting_key_enum,
    public readonly value: string | null,
    public readonly updated_at: Date | null,
    public readonly updated_by_id: number | null,
    public readonly user_id: number | null,
    public readonly user?: IUserModel,
    public readonly user_settings_user_idTouser?: IUserModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new SettingModel(
      0,
      setting_key_enum.DATA_CLEANUP_PERIOD,
      null,
      null,
      null,
      null
    );
  }

  public static get instance(): SettingModel {
    return this._instance;
  }

  public static get partialInstance(): SettingModel {
    return new SettingModel(
      this._instance.id,
      this._instance.key,
      this._instance.value,
      this._instance.updated_at,
      this._instance.updated_by_id,
      this._instance.user_id,
    );
  }

  public static async findMany<T extends Prisma.settingsFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.settingsFindManyArgs>
  ): Promise<Prisma.settingsGetPayload<T>[]> {
    return await this.setting.findMany(args);
  }

  public static async findUnique<T extends Prisma.settingsFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.settingsFindUniqueArgs>
  ): Promise<Prisma.settingsGetPayload<T> | null> {
    return await this.setting.findUnique(args);
  }

  public static async findFirst<T extends Prisma.settingsFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.settingsFindFirstArgs>
  ): Promise<Prisma.settingsGetPayload<T> | null> {
    return await this.setting.findFirst(args);
  }

  public static async create<T extends Prisma.settingsCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.settingsCreateArgs>
  ): Promise<Prisma.settingsGetPayload<T>> {
    return await this.setting.create(args);
  }

  public static async update<T extends Prisma.settingsUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.settingsUpdateArgs>
  ): Promise<Prisma.settingsGetPayload<T>> {
    return await this.setting.update(args);
  }
}

export { setting_key_enum as SettingKeyEnum };
