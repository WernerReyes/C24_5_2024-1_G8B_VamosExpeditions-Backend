import { AuthSocket } from "./auth/auth.socket";
import { NotificationSocket } from "./notification/notification.socket";

export class AppSocket {
  get sockets(): [AuthSocket, NotificationSocket] {
    return [new AuthSocket(), new NotificationSocket()];
  }
}
