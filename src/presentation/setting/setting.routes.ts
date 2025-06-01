import {
  type Request,
  type RequestHandler,
  type Response,
  Router,
} from "express";
import { Middleware, type RequestAuth } from "../middleware";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";
import { RoleEnum } from "@/infrastructure/models";

export class SettingRoutes {
  public static get routes(): Router {
    const router = Router();

    const settingService = new SettingService();
    const settingController = new SettingController(settingService);

    router.use([Middleware.validateToken]);

    router.get("/", (req: Request, res: Response) =>
      settingController.getAll(req as RequestAuth, res)
    );

    router.put(
      "/dynamic-cleanup",
      Middleware.validateActionPermission([
        RoleEnum.MANAGER_ROLE,
      ]) as RequestHandler,
      (req: Request, res: Response) =>
        settingController.updateDynamicCleanup(req as RequestAuth, res)
    );
    router.put("/max-active-session", (req: Request, res: Response) =>
      settingController.updateMaxActiveSessions(req as RequestAuth, res)
    );

    return router;
  }
}
