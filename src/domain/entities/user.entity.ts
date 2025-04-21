import type { role, user } from "@prisma/client";
import { RoleEntity } from "./role.entity";
import { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";
import { AuthContext } from "@/presentation/auth/auth.context";
import { UserContext } from "@/presentation/user/user.context";
// import { UserContext } from "@/presentation/user/user.context";

export interface User extends Omit<user, "password" | "id_role"> {
  role?: role;
}
export class UserEntity {
  private constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly online?: boolean,
    public readonly role?: RoleEntity,
    public readonly description?: string,
    public readonly phoneNumber?: string
  ) {}

  public static async fromObject(user: User): Promise<UserEntity> {
    const {
      id_user,
      fullname,
      email,
      role,
      description,
      phone_number,
    } = user;

    return new UserEntity(
      id_user,
      fullname,
      email,
      UserContext.isOnline(id_user),
      role ? RoleEntity.fromObject(role) : undefined,
      description ?? undefined,
      phone_number ?? undefined
    );
  }

}
