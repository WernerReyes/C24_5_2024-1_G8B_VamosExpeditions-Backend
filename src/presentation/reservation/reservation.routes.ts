import { Router } from "express";
import { Middleware } from "../middleware";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";
import { ReservationMapper } from "./reservation.mapper";
import { PdfService } from "@/lib";

export class ReservationRoutes {
  static get routes(): Router {
    const router = Router();

    const pdfService = new PdfService();
    const reservationMapper = new ReservationMapper();
    const reservationService = new ReservationService(
      reservationMapper,
      pdfService
    );
    const reservationController = new ReservationController(reservationService);

    router.use(Middleware.validateToken);

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
