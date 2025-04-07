import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { Middleware, type RequestAuth } from "../middleware";

export class NotificationRoutes {
  static get routes(): Router {
    const router = Router();

    const notificationController = new NotificationController(
      new NotificationService()
    );
    router.use(Middleware.validateToken);
    
    router.get("/messages", (req, res) => 
      notificationController.listUserNotifications(req as RequestAuth, res)
    );
    router.post("/delete", notificationController.deleteNotifications);
    router.put("/mark-as-read", notificationController.markNotificationsAsRead);

    return router;
  }
}
