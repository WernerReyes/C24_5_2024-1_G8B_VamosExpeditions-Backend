import { Server, Socket } from "socket.io";

import { Middleware } from "@/presentation/middleware";
import { NotificationService } from "@/presentation/notification/notification.service";

export class SocketService {
  constructor(
    private io: Server,
    private notificationService: NotificationService
  ) {
    io.use(Middleware.validateSocketToken);
    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on("connection", async (socket: Socket) => {
      try {
        await this.handleSuccessfulConnection(socket);
        this.setupMessageHandler(socket);
        this.setupDisconnectHandler(socket);
      } catch (error) {
        console.error("⚠️ Error durante la conexión:", error);
        socket.disconnect();
      }
    });
  }

  private async handleSuccessfulConnection(socket: Socket) {
    const connectUserId = await this.notificationService.connectUserSocket(
      parseInt(socket.data.id)
    );

    socket.join(String(socket.data.id));
    this.io.emit("userConnected", connectUserId);
    console.log(`🔌 Cliente conectado: ${socket.data.id}`);
  }

  public setupMessageHandler(socket: Socket) {
    socket.on("personal-message", async (data) => {
      
      
      const messages = await this.notificationService.NotificationMessage(data);
      
      if (messages) this.emitMessages(messages);
    });
  }

  private emitMessages(messages: any[]) {
    messages?.forEach((message) => {
      
      this.io.to(String(message.to_user)).emit("personal-message", message);
    });
  }

  private setupDisconnectHandler(socket: Socket) {
    socket.on("disconnect", async () => {
      const disconnecUserId =
        await this.notificationService.disconnectUserSocket(
          parseInt(socket.data.id)
        );
      this.io.emit("userDisconnected", disconnecUserId);
      console.log(`🔌 Cliente userDisconnected  ${socket.data.id}`);
    });
  }
}
