import { Router } from "express";
import { Middleware } from "../middleware";
import { TripDetailsController } from "./tripDetails.controller";
import { TripDetailsMapper } from "./tripDetails.mapper";
import { TripDetailsService } from "./tripDetails.service";

export class TripDetailsRoutes {
  static get routes(): Router {
    const router = Router();

    const tripDetailsMapper = new TripDetailsMapper();
    const tripDetailsService = new TripDetailsService(tripDetailsMapper);
    const tripDetailsController = new TripDetailsController(tripDetailsService);

    router.use(Middleware.validateToken);

    router.post("", tripDetailsController.upsertTripDetails);
    router.put("/:id", tripDetailsController.upsertTripDetails);
    return router;
  }
}
