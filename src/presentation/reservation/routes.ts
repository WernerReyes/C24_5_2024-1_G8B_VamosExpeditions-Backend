import { Router } from "express";
import { ReservationController } from "./controller";
import { ReservationResponse, ReservationService } from "../services/reservation";


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