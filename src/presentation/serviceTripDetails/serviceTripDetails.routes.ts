import { Router } from "express";
import { ServiceTripDetailsMapper } from "./serviceTripDetails.mapper";
import { ServiceTripDetailsService } from "./serviceTripDetails.service";
import { ServiceTripDetailsController } from "./serviceTripDetails.controller";
import { Middleware } from "../middleware";

export class ServiceTripDetailsRoutes {
  public static get routes(): Router {
    const router = Router();

    router.use(Middleware.validateToken);

    const serviceTripDetailsMapper = new ServiceTripDetailsMapper();
    const serviceTripDetailsService = new ServiceTripDetailsService(
      serviceTripDetailsMapper
    );
    const serviceTripDetailsController = new ServiceTripDetailsController(
      serviceTripDetailsService
    );

    router.post("/many", serviceTripDetailsController.insertMany);

    return router;
  }
}
