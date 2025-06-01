import type { CacheAdapter } from "@/core/adapters";
import { EnvsConst } from "@/core/constants";
import type { UserEntity } from "@/domain/entities";
import {
  SettingKeyEnum,
  SettingModel,
  type RoleEnum,
} from "@/infrastructure/models";
import { SocketService } from "@/infrastructure";

export type AuthUser = {
  id: UserEntity["id"];
  role: RoleEnum;
  deviceId: string;
};

export class AuthContext {
  private static _socketService?: SocketService = undefined;

  private static _expirationTime: number = EnvsConst.REDIS_USER_EXPIRATION;

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

    const maxDevices = await SettingModel.findFirst({
      where: {
        key: SettingKeyEnum.MAX_ACTIVE_SESSIONS,
        user_id: userId,
      },
      select: {
        value: true,
      },
    });

    // Eliminar el dispositivo más antiguo si se supera el límite
    if (devices.length >= Number(maxDevices!.value)) {
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

  public static async getActiveDevices(
    userId: UserEntity["id"]
  ): Promise<string[]> {
    const devicesKey = `user:${userId}:devices`;
    const devices = (await this.cache?.sMembers<string>(devicesKey)) ?? [];
    return devices;
  }

  public static async disconnectDevice(
    userId: UserEntity["id"],
    deviceId: string
  ) {
    const key = `user:${userId}:${deviceId}`;
    await this.cache?.del(key)
    await this.cache?.sRem(`user:${userId}:devices`, deviceId);
    await this.cache?.zRem(`user:${userId}:device_timestamps`, deviceId);

     // Emitir evento a través de SocketService
     this._socketService?.io.to(userId.toString()).emit("disconnect-device", deviceId);
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
