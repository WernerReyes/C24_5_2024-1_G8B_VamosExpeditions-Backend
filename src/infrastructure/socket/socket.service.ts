import { Middleware } from "@/presentation/middleware";

import type { AppSocket } from "@/presentation/socket";
import { UserContext } from "../../presentation/user/user.context";

import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";

export class SocketService {
  private static _instance: SocketService;
  public io: SocketServer;

  constructor(
    private readonly server: Server,
    private readonly appSocket: AppSocket,
    private readonly origins: string[]
  ) {
    this.io = new SocketServer(this.server, {
      cors: {
        origin: this.origins,
        credentials: true,
      },
    });
    this.io.use(Middleware.validateSocketToken);

    if (!SocketService._instance) {
      SocketService._instance = this;
    }

    console.log("Socket connected");
  }

  static get instance(): SocketService {
    if (!SocketService._instance) {
      throw new Error("SocketService instance not created yet.");
    }
    return SocketService._instance;
  }


  initEvents() {
    this.io.on("connection", async (socket: Socket) => {
      try {
        const userId = socket.data.id;
        const deviceId = socket.data.deviceId
        if (!UserContext.isOnline(userId)) {
          UserContext.addConnection(userId, 
            deviceId, // TODO: CHECK THIS
          );
        }

        if (userId) socket.join(userId);
  if (deviceId) socket.join(deviceId);

        const [authSocket, notificationSocket] = this.appSocket.sockets;
        authSocket.loginSocket(socket);
        notificationSocket.setupMessageHandler(socket);

        socket.on("disconnect", () => {
          authSocket.logoutSocket(socket);

          console.log(
            `❌ User ${userId} disconnected with socket ID: ${deviceId}`
          )
        });
        console.log(`🔗 User ${userId} connected with socket ID: ${deviceId}`);
      } catch (error) {
        console.error("⚠️ Error durante la conexión:", error);
        socket.disconnect();
      }
    });
  }
}
