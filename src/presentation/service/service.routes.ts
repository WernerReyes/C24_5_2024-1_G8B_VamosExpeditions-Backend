import { Router } from "express";
import { Middleware } from "../middleware";
import { ServiceMapper } from "./service.mapper";
import { ServiceService } from "./service.service";
import { ServiceController } from "./service.controller";

export class ServiceRoutes {
  public static get routes(): Router {
    const router = Router();
    router.use([Middleware.validateToken]);

    const serviceMapper = new ServiceMapper();
    const serviceService = new ServiceService(serviceMapper);
    const serviceControler = new ServiceController(serviceService);

    router.get("/", serviceControler.getAll);

    return router;
  }
}
