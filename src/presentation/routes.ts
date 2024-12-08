import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { ClientRoutes } from "./client/routes";

export class AppRoutes {
  private static prefix: string = "/api/v1";

  static get routes(): Router {
    const router = Router();

    router.use(`${this.prefix}/auth`, AuthRoutes.routes);
    router.use(`${this.prefix}/client`, ClientRoutes.routes);

    return router;
  }
}
