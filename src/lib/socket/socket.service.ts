import { Middleware } from "@/presentation/middleware";
import type { AppSocket } from "@/presentation/socket";
import { Server } from "http";
import { Socket, Server as SocketServer } from "socket.io";

export class SocketService {
  private static _instance: SocketService;
  public io: SocketServer;

  public userConnections: Map<string, Set<string>> = new Map();

  constructor(
    private server: Server,
    private appSocket: AppSocket,
  ) {
    this.io = new SocketServer(this.server, {
      cors: {
        origin: [
          // client_url,
          "http://localhost:5173",
          "https://c24-5-2024-1-g8b-vamosexpeditions-backend.onrender.com",
          "http://localhost:8000",
          "https://vamosexpeditions.netlify.app",
          "http://192.168.100.130:5173",
        ],
        credentials: true,
      },
      /* pingInterval: 25000,
      pingTimeout: 20000, */
    });
    this.io.use(Middleware.validateSocketToken);

    if (!SocketService._instance) {
      SocketService._instance = this;
    }
  }

  static get instance(): SocketService {
    if (!SocketService._instance) {
      throw new Error("SocketService instance not created yet.");
    }
    return SocketService._instance;
  }

  initEvents() {
    console.log("🔌 Inicializando eventos de socket...");
    this.io.on("connection", async (socket: Socket) => {
      try {
        const userId = socket.data.id;

        // Registrar conexión
        if (!this.userConnections.has(userId)) {
          this.userConnections.set(userId, new Set());
        }
        this.userConnections.get(userId)!.add(socket.id);

        const [authSocket, notificationSocket] = this.appSocket.sockets;
        authSocket.loginSocket(socket);
        authSocket.logoutSocket(socket);
        notificationSocket.setupMessageHandler(socket);
      } catch (error) {
        console.error("⚠️ Error durante la conexión:", error);
        socket.disconnect();
      }
    });
  }


  // public setupMessageHandler(socket: Socket) {
  //   socket.on("personal-message", async (data) => {
  //     const messages = await this.notificationService.NotificationMessage(data);

  //     if (messages) this.emitMessages(messages);
  //   });
  // }

  // private emitMessages(messages: any[]) {
  //   messages?.forEach((message) => {
  //     this.io.to(String(message.to_user)).emit("personal-message", message);
  //   });
  // }
}
