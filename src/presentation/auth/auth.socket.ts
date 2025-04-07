import { CacheAdapter } from "@/core/adapters";
import { CacheConst } from "@/core/constants";
import { SocketService } from "@/lib";
import { Socket } from "socket.io";

export class AuthSocket {
  private _socketService = SocketService.instance;

  private userConnections = this._socketService.userConnections;

  private get cache(): CacheAdapter {
    return CacheAdapter.getInstance();
  }

  async loginSocket(socket: Socket) {
    socket.join(String(socket.data.id));

    //* Save user connection
    await this.cache.sAdd(CacheConst.ONLINE_USERS, socket.data.id);

    this._socketService.io.emit("userConnected", socket.data.id);
  }

  async logoutSocket(socket: Socket) {
    socket.on("disconnect", () => {
      const connections = this.userConnections.get(socket.data.id);
      if (connections) {
        connections.delete(socket.id);
        if (connections.size === 0) {
          //* Remove user connection from cache
          this.cache.sRem(CacheConst.ONLINE_USERS, socket.data.id);

          this._socketService.io.emit("userDisconnected", socket.data.id);
        }
      }
    });
  }
}
