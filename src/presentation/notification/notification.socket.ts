import { SocketService } from "@/lib";
import type { Socket } from "socket.io";
import { NotificationService } from "./notification.service";
import type { NotificationMessageEntity } from "@/domain/entities";

export class NotificationSocket {
  private io = SocketService.instance.io;

  private notificationService = NotificationService.getInstance();

  public setupMessageHandler(socket: Socket) {
    socket.on("personal-message", async (data) => {
      const messages = await this.notificationService.NotificationMessage(data);

      if (messages) this.emitMessages(messages);
    });
  }

  private emitMessages(messages: NotificationMessageEntity[]) {
    messages?.forEach((message) => {
      this.io.to(String(message.to_user)).emit("personal-message", message);
    });
  }
}
