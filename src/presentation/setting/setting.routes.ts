import { Router } from "express";
import { Middleware } from "../middleware";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";

export class SettingRoutes {
  public static get routes(): Router {
    const router = Router();

    const settingService = new SettingService();
    const settingController = new SettingController(settingService);

    router.use([Middleware.validateToken]);

    router.get("/", settingController.getAll);

    return router;
  }
}
