import type { role, user } from "@prisma/client";
import { RoleEntity } from "./role.entity";
import { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";

export interface User extends Omit<user, "password" | "id_role"> {
  role?: role;
}
export class UserEntity {
  private static get cache(): CacheAdapter {
    return CacheAdapter.getInstance();
  }

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
      await this.getUserOnline(id_user),
      role ? RoleEntity.fromObject(role) : undefined,
      description ?? undefined,
      phone_number ?? undefined
    );
  }

  private static async getUserOnline(id: number): Promise<boolean> {
    try {
      const cachedUser = await this.cache.sMembers<UserEntity["id"]>(
        CacheConst.ONLINE_USERS
      );
      return cachedUser.includes(id);
    } catch (e) {
      return false;
    }
  }
}
