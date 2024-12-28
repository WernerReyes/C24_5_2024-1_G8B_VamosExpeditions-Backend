import { Middleware } from "../middleware";
import { ReservationController } from "./reservation.controller";
import { ReservationResponse } from "./reservation.response";
import { ReservationService } from "./reservation.service";
import { Router } from "express";
import { ReservationMapper } from "./reservation.mapper";

export class ReservationRoutes {
  static get routes(): Router {
    const router = Router();

    const reservationMapper = new ReservationMapper();
    const reservationResponse = new ReservationResponse();
    const reservationService = new ReservationService(
      // reservationMapper,
      reservationResponse
    );
    const reservationController = new ReservationController(reservationService);

    router.use(Middleware.validateToken);
    router.post("/register", reservationController.registerReservation);
    // router.get("/:id", reservationController.getReservationById);

    return router;
  }
}
