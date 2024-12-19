import { Middleware } from "../middleware";
import { ReservationController } from "./reservation.controller";
import { ReservationResponse } from "./reservation.response";
import { ReservationService } from "./reservation.service";
import { Router } from "express";

export class ReservationRoutes{
    

    static get routes(): Router {
        const router = Router();
        
        const reservationResponse = new ReservationResponse();
        const reservationService = new ReservationService(reservationResponse);
        const reservationController = new ReservationController(reservationService);
         
        router.use(Middleware.validateToken);
        router.post("/register", reservationController.registerReservation);
        
        return router;
      }

    
}