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
  device: {
    id: string;
    model?: string;
    version?: string;
    name: string;
    createdAt: Date;
  };
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

  private static getKey(userId: UserEntity["id"], deviceId: string) {
    return `userInfo:${userId}:${deviceId}`;
  }

  public static async getAuthenticatedUser(
    userId: AuthUser["id"],
    deviceId: AuthUser["device"]["id"]
  ): Promise<AuthUser | undefined | null> {
    const key = this.getKey(userId, deviceId);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
    return await this.cache?.get(key);
  }

  public static async authenticateUser(user: AuthUser) {
    const { id: userId, device } = user;

    const key = this.getKey(userId, device.id);

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
      const oldestDeviceId = devices[devices.length - 1].split(":")[2];
      if (oldestDeviceId) {
        await this.cache?.del(this.getKey(userId, oldestDeviceId)),
          // Emitir evento a través de SocketService
          this._socketService?.io.to(userId.toString()).emit("force-logout", {
            newDeviceId: device.id,
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
  }

  private static async getActiveDevicesSorted(
    userId: number
  ): Promise<string[]> {
    const deviceIds =
      (await this.cache?.scan(`userInfo:${userId}:*`)) ?? [];

    if (deviceIds.length === 0) return [];

    const values = await this.cache?.mGet<AuthUser>(deviceIds);

    //* Sort devices by timestamp from newest to oldest
    const sortedDeviceIds = values
      ?.map((value, index) => ({
        id: deviceIds[index],
        timestamp: new Date(value?.device.createdAt).getTime(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((item) => item.id);

    return sortedDeviceIds ?? [];
  }

  public static async disconnectDevice(
    userId: UserEntity["id"],
    deviceId: string
  ) {
    const key = this.getKey(userId, deviceId);
    await this.cache?.del(key);

    // Emitir evento a través de SocketService
    this._socketService?.io
      .to(userId.toString())
      .emit("disconnect-device", deviceId);
  }

  public static async deauthenticateUser(user: AuthUser) {
    const { id, device } = user;
    const key = this.getKey(id, device.id);
    await this.cache?.del(key);
  }
}
