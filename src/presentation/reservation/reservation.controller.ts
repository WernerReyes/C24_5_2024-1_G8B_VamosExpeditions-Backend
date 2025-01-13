import { AppController } from "../controller";
import { CustomError } from "@/domain/error";
import { Request, Response } from "express";

import { GetReservationsDto, ReservationDto } from "@/domain/dtos";

import { ReservationService } from "./reservation.service";

export class ReservationController extends AppController {
  constructor(private reservationService: ReservationService) {
    super();
  }

  public createReservation = (req: Request, res: Response) => {
    const [error, createreservationtDto] = ReservationDto.create(req.body);
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.reservationService
      .createReservation(createreservationtDto!)
      .then((reservation) => res.status(201).json(reservation))
      .catch((error) => this.handleError(res, error));
  };

  public updateReservation = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateReservationDto] = ReservationDto.create(req.body);
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.reservationService
      .updateReservation(+id, updateReservationDto!)
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleError(res, error));
  };

  public getReservationById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.reservationService
      .getReservationById(+id)
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleError(res, error));
  };

  public getReservations = (req: Request, res: Response) => {
    const [error, getReservationsDto] = GetReservationsDto.create(req.query);
    if (error) return this.handleError(res, CustomError.badRequest(error));
    this.reservationService
      .getReservations(getReservationsDto!)
      .then((reservations) => res.status(200).json(reservations))
      .catch((error) => this.handleError(res, error));
  };
}
