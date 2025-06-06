import type { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";

export class UserContext {
  private static _onlineUsers: Map<number, Set<string>> = new Map();
  private static cache?: CacheAdapter = undefined;

  public static async initialize(cache: CacheAdapter) {
    this.cache = cache;

    const onlineUserIds = await this.cache.sMembers<number>(
      CacheConst.ONLINE_USERS
    );
    onlineUserIds.forEach((userId) => {
      this._onlineUsers.set(userId, new Set());
    });
  }

  public static isOnline(userId: number): boolean {
    return this._onlineUsers.has(userId);
  }

  public static getConnections(){
    return this._onlineUsers
  }

  public static getConnectionsByUser(userId: number): Set<string> | undefined {
    return this._onlineUsers.get(userId);
  }

  public static async addConnection(userId: number, connectionId: string) {
    if (!this._onlineUsers.has(userId)) {
      this._onlineUsers.set(userId, new Set());
      await this.cache?.sAdd(CacheConst.ONLINE_USERS, userId);
    }

    this._onlineUsers.get(userId)?.add(connectionId);
    
  }


  public static async removeConnection(userId: number) {
    this._onlineUsers.delete(userId);
    await this.cache?.sRem(CacheConst.ONLINE_USERS, userId);
  }
}
