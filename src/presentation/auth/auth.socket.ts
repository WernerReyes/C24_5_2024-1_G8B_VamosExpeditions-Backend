import { SocketService } from "@/lib";
import { Socket } from "socket.io";
import { UserContext } from "../user/user.context";

export class AuthSocket {
  private _socketService = SocketService.instance;

  async loginSocket(socket: Socket) {
    socket.join(String(socket.data.id));

    //* Save user connection
    UserContext.addConnection(socket.data.id, socket.id);

    this._socketService.io.emit("userConnected", socket.data.id);
  }

  async logoutSocket(socket: Socket) {
    socket.on("disconnect", () => {
      const connections = UserContext.getConnections(socket.data.id);
      if (!connections) return;

      //* Remove user connection from cache
      connections.delete(socket.id);

      if (connections.size === 0) {
        UserContext.removeConnection(socket.data.id, socket.id);
        this._socketService.io.emit("userDisconnected", socket.data.id);
      }
    });
  }
}
