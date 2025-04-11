import { Router } from "express";
import { Middleware } from "../middleware";
import { ReservationController } from "./reservation.controller";
import { ReservationMapper } from "./reservation.mapper";
import { ReservationService } from "./reservation.service";

export class ReservationRoutes {
  static get routes(): Router {
    const router = Router();

    
    const reservationMapper = new ReservationMapper();
    const reservationService = new ReservationService(
      reservationMapper,
    
    );
    const reservationController = new ReservationController(reservationService);

    router.use(Middleware.validateToken);

  
    router.post("", reservationController.upsertReservation);
    router.put("/:id/cancel", reservationController.cancelReservation);
    router.delete(
      "/multiple",
      reservationController.deleteMultipleReservations
    );
    router.put("/:id", reservationController.upsertReservation);
    router.get("", reservationController.getReservations);
    router.get("/stadistics", reservationController.getStadistics);
    router.get("/stats", reservationController.getStats);
    return router;
  }
}
