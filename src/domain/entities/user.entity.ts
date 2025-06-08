import type { IUserModel } from "@/infrastructure/models";
import { AuthContext, AuthUser } from "@/presentation/auth/auth.context";
import { UserContext } from "@/presentation/user/user.context";
import { RoleEntity } from "./role.entity";
import { SettingEntity } from "./settting.entity";

export class UserEntity {
  private constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly online: boolean,
    public readonly description?: string,
    public readonly phoneNumber?: string,
    public readonly isDeleted?: boolean,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string,
    public readonly role?: RoleEntity,
    public readonly settings?: SettingEntity[]
  ) {}

  public static async fromObject(user: {
    [key: string]: any;
  }): Promise<UserEntity> {
    const {
      id_user,
      fullname,
      email,
      role,
      description,
      phone_number,
      created_at,
      updated_at,
      is_deleted,
      deleted_at,
      delete_reason,
      settings_settings_user_idTouser,
    } = user as IUserModel;
    return new UserEntity(
      id_user,
      fullname,
      email,
      created_at,
      updated_at,
      UserContext.isOnline(id_user),
      description ?? undefined,
      phone_number ?? undefined,
      is_deleted ?? undefined,
      deleted_at ?? undefined,
      delete_reason ?? undefined,
      role ? RoleEntity.fromObject(role) : undefined,
      settings_settings_user_idTouser
        ? await Promise.all(
            settings_settings_user_idTouser.map((setting) =>
              SettingEntity.fromObject(setting)
            )
          )
        : undefined
    );
  }
}
