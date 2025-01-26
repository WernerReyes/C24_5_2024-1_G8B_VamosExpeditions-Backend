import { AppController } from "../controller";
import { CustomError } from "@/domain/error";
import { Request, Response } from "express";

import { GetReservationsDto, ReservationDto } from "@/domain/dtos";

import { ReservationService } from "./reservation.service";

export class ReservationController extends AppController {
  constructor(private reservationService: ReservationService) {
    super();
  }
  public upsertReservation = (req: Request, res: Response) => {
    const [error, upsertReservationDto] = ReservationDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.reservationService
      .upsertReservation(upsertReservationDto!)
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
