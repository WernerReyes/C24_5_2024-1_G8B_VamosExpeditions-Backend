import { CacheAdapter } from "@/core/adapters";
import { SocketService } from "@/infrastructure";
import { Socket } from "socket.io";
import { UserContext } from "../user/user.context";
import type { AuthUser } from "./auth.context";

export class AuthSocket {
  private _socketService = SocketService.instance;

  async loginSocket(socket: Socket) {
    socket.join(String(socket.data.id));

 
    //* Save user connection
    await UserContext.addConnection(socket.data.id, socket.data.deviceId);

    this._socketService.io.emit("userConnected", {
      userId: socket.data.id,
      devices: await this.devices(),
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
        groupedDevices[userId] = [device]
        
      } else {
        groupedDevices[userId].push(device);
      }
    }

    return groupedDevices;
  }
}
