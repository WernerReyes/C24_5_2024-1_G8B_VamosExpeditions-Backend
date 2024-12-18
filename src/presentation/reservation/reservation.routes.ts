import { Router } from "express";
import { ReservationResponse } from "./reservation.response";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";

export class ReservationRoutes{
    

    static get routes(): Router {
        const router = Router();
        
        const reservationResponse = new ReservationResponse();
        const reservationService = new ReservationService(reservationResponse);
        const reservationController = new ReservationController(reservationService);

        router.post("/register", reservationController.registerReservation);
        
        return router;
      }

    
}