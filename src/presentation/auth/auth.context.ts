import type { CacheAdapter } from "@/core/adapters";
import { CacheConst, EnvsConst } from "@/core/constants";
import { RoleEntity, UserEntity } from "@/domain/entities";
import { SocketService } from "@/lib";
import { role } from "@prisma/client";

export type AuthUser = {
  id: UserEntity["id"];
  role: RoleEntity["name"] | role["name"];
  deviceId: string;
};

const MAX_DEVICES = 1;

export class AuthContext {
  private static _socketService?: SocketService = undefined;

  private static _expirationTime: number = Math.floor(EnvsConst.COOKIE_EXPIRATION / 1000)//*  Math.floor(864000000 / 1000), //* 1 day in seconds

  private static _authUsers: Map<UserEntity["id"], AuthUser> = new Map();

  private static cache?: CacheAdapter = undefined;

  public static async initialize(cache: CacheAdapter) {
    this.cache = cache;

    this._socketService = SocketService.instance;
  }

  public static get isInitialized() {
    return !!this.cache;
  }

  public static async getAuthenticatedUser(
    userId: AuthUser["id"],
    deviceId: AuthUser["deviceId"]
  ): Promise<AuthUser | undefined | null> {
    const key = `user:${userId}:${deviceId}`;
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
    return await this.cache?.get(key);
  }

  public static async authenticateUser(user: AuthUser) {
    const { id: userId, deviceId } = user;

    const key = `user:${userId}:${deviceId}`;
    const devicesKey = `user:${userId}:devices`;
    const zsetKey = `user:${userId}:device_timestamps`;

    // Obtener dispositivos activos ordenados por tiempo
    const devices = await this.getActiveDevicesSorted(userId);

    // Eliminar el dispositivo más antiguo si se supera el límite
    if (devices.length >= MAX_DEVICES) {
      const [oldestDeviceId] =
        (await this.cache?.zRange<string>(zsetKey, 0, 0)) ?? [];
      if (oldestDeviceId) {
        await Promise.all([
          this.cache?.del(`user:${userId}:${oldestDeviceId}`),
          this.cache?.sRem(devicesKey, oldestDeviceId),
          this.cache?.zRem(zsetKey, oldestDeviceId),
        ]);

        // Emitir evento a través de SocketService
        this._socketService?.io.to(userId.toString()).emit("force-logout", {
          newDeviceId: deviceId,
          oldDeviceId: oldestDeviceId,
        });
      }
    }

    // Guardar nuevo token con expiración
    await this.cache?.set(
      key,
      { ...user },
      {
        EX: this._expirationTime,
      }
    );

    // Registrar dispositivo en SET y ZSET
    await this.cache?.sAdd(devicesKey, deviceId);

    const now = Math.floor(Date.now() / 1000);
    await this.cache?.zAdd(zsetKey, {
      score: now,
      value: deviceId,
    });
  }

  private static async getActiveDevicesSorted(
    userId: number
  ): Promise<string[]> {
    const devicesKey = `user:${userId}:devices`;
    const zsetKey = `user:${userId}:device_timestamps`;

    const deviceIds = (await this.cache?.sMembers<string>(devicesKey)) ?? [];

    const existenceChecks = await Promise.all(
      deviceIds.map((id) => this.cache?.exists(`user:${userId}:${id}`))
    );

    const activeDeviceIds: string[] = [];

    for (let i = 0; i < deviceIds.length; i++) {
      const deviceId = deviceIds[i];
      if (existenceChecks[i]) {
        activeDeviceIds.push(deviceId);
      } else {
        // Limpiar entradas expiradas
        await Promise.all([
          this.cache?.sRem(devicesKey, deviceId),
          this.cache?.zRem(zsetKey, deviceId),
        ]);
      }
    }

    return activeDeviceIds;
  }

  public static async deauthenticateUser(user: AuthUser) {
    const { id, deviceId } = user;
    const key = `user:${id}:${deviceId}`;
    await this.cache?.del(key);
    // this._authUsers.delete(id);

    await this.cache?.sRem(`user:${id}:devices`, deviceId);
    await this.cache?.zRem(`user:${id}:device_timestamps`, deviceId);
  }
}
