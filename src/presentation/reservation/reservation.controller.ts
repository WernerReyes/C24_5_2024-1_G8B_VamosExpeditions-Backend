import { AppController } from '../controller';
import { CustomError } from '@/domain/error';
import { Request, Response } from 'express';
import { ReservationDto } from '@/domain/dtos';
import { ReservationService } from './reservation.service';



export class ReservationController extends AppController {

    constructor(
        private reservationService:ReservationService
    ) { 
        super();
    }

    public registerReservation = (req: Request, res: Response) => {
        console.log(req.body);
     const [error, createreservationtDto]   =ReservationDto.create(req.body);
    if (error) return this.handleError(res, CustomError.badRequest(error));
  
    this.reservationService.registerReservation(createreservationtDto!)
    .then( reservation=> res.status( 201 ).json( reservation ) )
    .catch((error) => this.handleError(res, error));

    }

    public getReservationById = (req: Request, res: Response) => {
        const { id } = req.params;
        this.reservationService.getReservationById(+id)
        .then( reservation => res.status( 200 ).json( reservation ) )
        .catch((error) => this.handleError(res, error));
    }

} 