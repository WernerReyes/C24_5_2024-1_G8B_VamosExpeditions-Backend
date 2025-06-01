import { Router } from "express";
import { Middleware } from "../middleware";
import { ServiceTypeMapper } from "./serviceType.mapper";
import { ServiceTypeService } from "./serviceType.service";
import { ServiceTypeController } from "./serviceType.controller";

export class ServiceTypeRoutes {
  public static get routes(): Router {
    const router = Router();

    router.use(Middleware.validateToken);

    const serviceTypeMapper = new ServiceTypeMapper();
    const serviceTypeService = new ServiceTypeService(serviceTypeMapper);
    const serviceTypeController = new ServiceTypeController(serviceTypeService);

    router.get("/", serviceTypeController.getAll);

    return router;
  }
}
