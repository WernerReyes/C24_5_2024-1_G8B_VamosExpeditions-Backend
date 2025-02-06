import { Router } from "express";
import { Middleware } from "../middleware";
import { ReservationController } from "./reservation.controller";
import { ReservationResponse } from "./reservation.response";
import { ReservationService } from "./reservation.service";
import { ReservationMapper } from "./reservation.mapper";
import { PdfService } from "@/lib";

export class ReservationRoutes {
  static get routes(): Router {
    const router = Router();

    const  pdfService = new PdfService();
    const reservationMapper = new ReservationMapper();
    const reservationResponse = new ReservationResponse();
    const reservationService = new ReservationService(
      reservationMapper,
      reservationResponse,
      pdfService 
    );
    const reservationController = new ReservationController(reservationService);

   /*  router.use(Middleware.validateToken) */;
    router.post("", reservationController.upsertReservation);
    router.put("/:id", reservationController.upsertReservation);
    router.get("/:id", reservationController.getReservationById);
    router.get("", reservationController.getReservations);
    router.get("/pdf/:id", reservationController.getReservationPdf);
    return router;
  }
}
