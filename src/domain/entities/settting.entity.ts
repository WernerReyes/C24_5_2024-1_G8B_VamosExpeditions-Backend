import type { ISettingModel, SettingKeyEnum } from "@/infrastructure/models";
import { UserEntity } from "./user.entity";

export class SettingEntity {
  private constructor(
    public readonly id: number,
    public readonly key: SettingKeyEnum,
    public readonly value: string | null,
    public readonly updatedAt: Date | null,
    public readonly updatedBy?: UserEntity,
    public readonly user?: UserEntity
  ) {}

  public static async fromObject(object: {
    [key: string]: any;
  }): Promise<SettingEntity> {
    const { id, key, value, updated_at, user, user_settings_user_idTouser } =
      object as ISettingModel;

    return new SettingEntity(
      id,
      key,
      value,
      updated_at,
      user && (await UserEntity.fromObject(user)),
      user_settings_user_idTouser && (await UserEntity.fromObject(user_settings_user_idTouser))
    );
  }
}
