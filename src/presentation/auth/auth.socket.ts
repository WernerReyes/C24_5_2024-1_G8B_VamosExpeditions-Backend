import { CacheAdapter } from "@/core/adapters";
import { SocketService } from "@/infrastructure";
import { Socket } from "socket.io";
import { UserContext } from "../user/user.context";
import type { AuthUser } from "./auth.context";
import { UserEntity } from "@/domain/entities";

export class AuthSocket {
  private _socketService = SocketService.instance;

  public static get instance() {
    return new AuthSocket();
  }

  async loginSocket(socket: Socket) {
    socket.join(String(socket.data.id));

    //* Save user connection
    await UserContext.addConnection(socket.data.id, socket.data.deviceId);

    this._socketService.io.emit("userConnected", {
      userId: socket.data.id,
      devices: await this.devices(),
    });
  }

  async confirm2FASocket(deviceId: string) {
    //* Emit event to user
    this._socketService.io.to(deviceId).emit("2fa-verified", {
      success: true,
    });
  }

  async logoutSocket(socket: Socket) {
    const connections = UserContext.getConnectionsByUser(socket.data.id);
    if (!connections) return;

    //* Remove user connection from cache
    connections.delete(socket.data.deviceId);

    this._socketService.io.emit("deviceDisconnected", {
      userId: socket.data.id,
      devices: await this.devices(),
    });

    if (connections.size === 0) {
      UserContext.removeConnection(socket.data.id);
      this._socketService.io.emit("userDisconnected", socket.data.id);
    }
  }

  private async devices() {
    const data = await CacheAdapter.getInstance().scan("userInfo:*");

    if (data.length === 0) return [];
    const values = await CacheAdapter.getInstance().mGet<AuthUser>(data);

    const connections = Array.from(UserContext.getConnections());
    const flattened = connections.flatMap(([_, set]) => Array.from(set));

    const groupedDevices: {
      [userId: string]: AuthUser["device"][];
    } = {};

    for (const value of values) {
      if (!value) continue;

      const userId = value.id;
      const device = {
        ...value.device,
        isOnline: flattened.includes(value.device.id),

        // Laste connection
      };

      if (!groupedDevices[userId]) {
        groupedDevices[userId] = [device];
      } else {
        groupedDevices[userId].push(device);
      }
    }

    return groupedDevices;
  }
}
// {
//   browserName: 'Brave',
//   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZGV2aWNlSWQiOiIzMjc0ZDcyMy0zMTNhLTQ5NTAtOTE1My03OTg1MTBkMTdjNTgiLCJpYXQiOjE3NDkyMzIyMzUsImV4cCI6MTc0OTIzMjgzNX0.HPiTmZGvzTZQweLwft8ki6-4OjRMkloTUz8-w5wCZk8'
// } {
//   headers: {
//     host: 'localhost:8000',
//     connection: 'Upgrade',
//     pragma: 'no-cache',
//     'cache-control': 'no-cache',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
//     'accept-language': 'es-ES,es;q=0.9',
//     upgrade: 'websocket',
//     origin: 'http://localhost:5173',
//     'sec-websocket-version': '13',
//     'accept-encoding': 'gzip, deflate, br, zstd',
//     'sec-websocket-key': 'Wq4vVcQa0RDVjn5p8J0+Zg==',
//     'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits'
//   },
//   time: 'Fri Jun 06 2025 12:55:21 GMT-0500 (hora estándar de Perú)',
//   address: '::1',
//   xdomain: true,
//   secure: false,
//   issued: 1749232521767,
//   url: '/socket.io/?EIO=4&transport=websocket',
//   query: [Object: null prototype] { EIO: '4', transport: 'websocket' },
//   auth: {
//     browserName: 'Brave',
//     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZGV2aWNlSWQiOiIzMjc0ZDcyMy0zMTNhLTQ5NTAtOTE1My03OTg1MTBkMTdjNTgiLCJpYXQiOjE3NDkyMzIyMzUsImV4cCI6MTc0OTIzMjgzNX0.HPiTmZGvzTZQweLwft8ki6-4OjRMkloTUz8-w5wCZk8'
//   }
// }
// {
//   id: 2,
//   deviceId: '3274d723-313a-4950-9153-798510d17c58',
//   iat: 1749232235,
//   exp: 1749232835
// }
