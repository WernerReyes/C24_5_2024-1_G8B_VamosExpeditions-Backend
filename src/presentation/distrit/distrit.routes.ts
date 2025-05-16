import { Router } from "express";
import { DistritService } from "./distrit.service";
import { DistritController } from "./distrit.controller";
import { Middleware } from "../middleware";
import { DistritMapper } from "./distrit.mapper";

export class DistritRoutes {
  static get routes(): Router {
    const router = Router();

    router.use(Middleware.validateToken);
    const distritMapper = new DistritMapper();
    const distritService = new DistritService(distritMapper);
    const distritController = new DistritController(distritService);

    router.get("", distritController.getAllDistrit);

    // start create, update and delete
    router.post("", distritController.upsertDistrit);
    router.put("/:id", distritController.upsertDistrit);
    // end create, update and delete

    return router;
  }
}
