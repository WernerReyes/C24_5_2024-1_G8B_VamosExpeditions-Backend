import type { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";
import { RoleEntity, UserEntity } from "@/domain/entities";
import { role } from "@prisma/client";

export type AuthUser = {
  id: UserEntity["id"];
  role: RoleEntity["name"] | role["name"];
  sessionsAmount?: number;
};

export class AuthContext {
  private static _authUsers: Map<UserEntity["id"], AuthUser> = new Map();
  private static cache?: CacheAdapter = undefined;

  public static async initialize(cache: CacheAdapter) {
    this.cache = cache;

    const authUsers = await this.cache?.hGetAll<AuthUser>(
      CacheConst.AUTH_USERS
    );

    if (authUsers) {
      for (const value of authUsers) {
        this._authUsers.set(Number(value.id), {
          ...value,
        });
      }
    }
  }

  public static getAuthenticatedUser(
    userId: AuthUser["id"]
  ): AuthUser | undefined {
    return this._authUsers.get(userId);
  }

  public static async authenticateUser(user: AuthUser) {
    const existingUser = this._authUsers.get(user.id);
    await this.cache?.hSet(CacheConst.AUTH_USERS, user.id.toString(), {
      ...user,
      sessionsAmount: existingUser?.sessionsAmount
        ? existingUser.sessionsAmount + 1
        : 1,
    });
    this._authUsers.set(user.id, {
      ...user,
      sessionsAmount: existingUser?.sessionsAmount
        ? existingUser.sessionsAmount + 1
        : 1,
    });
  }

  public static async deauthenticateUser(userId: AuthUser["id"]) {
    const user = this._authUsers.get(userId);
    if (!user) return;
    if (user.sessionsAmount) {
      user.sessionsAmount -= 1;
      await this.cache?.hSet(CacheConst.AUTH_USERS, user.id.toString(), user);
      this._authUsers.set(userId, user);
    }
    if (user.sessionsAmount === 0) {
      await this.cache?.hDel(CacheConst.AUTH_USERS, user.id.toString());
      this._authUsers.delete(userId);
    }
  }
}
