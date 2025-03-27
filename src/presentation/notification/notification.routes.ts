import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { Middleware } from "../middleware";

export class NotificationRoutes {
  static get routes(): Router {
    const router = Router();

    const notificationController = new NotificationController(
      new NotificationService()
    );
    router.use(Middleware.validateToken);
    router.get("/user", notificationController.getAllUserConected);
    router.get("/messages/:id", notificationController.listUserNotifications);
    router.post("/delete", notificationController.deleteNotifications);
    router.put("/mark-as-read", notificationController.markNotificationsAsRead);

    return router;
  }
}
