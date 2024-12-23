import { Router } from "express";
import { Middleware } from "../middleware";
import { NationController } from "./nation.controller";
import { NationService } from "./nation.service";
import { NationResponse } from "./nation.response";

export class NationRoutes {
  static get routes(): Router {
    const router = Router();

    router.use(Middleware.validateToken);
    const nationResponse = new NationResponse();
    const nationService = new NationService( nationResponse );
    const nationController = new NationController(nationService);

    router.get("", nationController.getAllNations);

    return router;
  }
}
