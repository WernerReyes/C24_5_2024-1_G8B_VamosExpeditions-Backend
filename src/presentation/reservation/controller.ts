import { Request, Response } from 'express';
import { ReservationService } from '../services/reservation';
import { ReservationDto } from '@/domain/dtos';
import { AppController } from '../controller';



export class ReservationController extends AppController {

    constructor(
        private reservationService:ReservationService
    ) { 
        super();
    }

    public registerReservation = (req: Request, res: Response) => {
     const [error, createreservationtDto]   =ReservationDto.create(req.body);
    if (error) return this.handleError(res, error);
  
    this.reservationService.registerReservation(createreservationtDto!)
    .then( reservation=> res.status( 201 ).json( reservation ) )
    .catch((error) => this.handleError(res, error));

    }

} 