import type { IUserModel } from "@/infrastructure/models";
import { AuthContext } from "@/presentation/auth/auth.context";
import { UserContext } from "@/presentation/user/user.context";
import { RoleEntity } from "./role.entity";

export class UserEntity {
  private constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly online: boolean,
    public readonly role?: RoleEntity,
    public readonly description?: string,
    public readonly phoneNumber?: string,
    public readonly isDeleted?: boolean,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string,
    
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
     
    } = user as IUserModel
    return new UserEntity(
      id_user,
      fullname,
      email,
      created_at,
      updated_at,
      UserContext.isOnline(id_user),
      role ? RoleEntity.fromObject(role) : undefined,
      description ?? undefined,
      phone_number ?? undefined,
      is_deleted ?? undefined,
      deleted_at ?? undefined,
      delete_reason ?? undefined,
      
    );
  }
}
