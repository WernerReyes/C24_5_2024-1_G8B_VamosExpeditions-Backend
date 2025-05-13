import { SocketService } from "@/infrastructure";
import { Socket } from "socket.io";
import { UserContext } from "../user/user.context";
import { UAParserAdapter } from "@/core/adapters";


export class AuthSocket {
  private _socketService = SocketService.instance;

  private getDeviceId(socket: Socket) {
    const userAgent = socket.request.headers["user-agent"];
    const browserName = socket.handshake.auth.browserName;

    const deviceId = UAParserAdapter.generateDeviceId(
      userAgent as string,
      browserName as string
    );

    return deviceId;
  }

  async loginSocket(socket: Socket) {
    socket.join(String(socket.data.id));

    const deviceId = this.getDeviceId(socket);

    //* Save user connection
    await UserContext.addConnection(socket.data.id, deviceId);

    this._socketService.io.emit("userConnected", {
      userId: socket.data.id,
      devices: this.devices,
    });
  }

  async logoutSocket(socket: Socket) {
    const connections = UserContext.getConnectionsByUser(socket.data.id);
    if (!connections) return;

    const deviceId = this.getDeviceId(socket);

    //* Remove user connection from cache
    connections.delete(deviceId);

    this._socketService.io.emit("deviceDisconnected", {
      userId: socket.data.id,
      devices: this.devices,
    });

    if (connections.size === 0) {
      UserContext.removeConnection(socket.data.id);
      this._socketService.io.emit("userDisconnected", socket.data.id);
    }
  }

  private get devices() {
    const devices = UserContext.getConnections();

    return Array.from(devices).map(([userId, devices]) => ({
      ids: devices ? Array.from(devices) : [],
      userId: userId,
    }));
  }
}
