import { AppController } from "../controller";
import { CustomError } from "@/domain/error";
import type { Request, Response } from "express";

import {
  TrashDto,
  GetReservationsDto,
  GetStadisticsDto,
  ReservationDto,
} from "@/domain/dtos";

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
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.reservationService.upsertReservation(upsertReservationDto!)
    )
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public cancelReservation = (req: Request, res: Response) => {
    this.handleError(this.reservationService.cancelReservation(+req.params.id))
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getReservations = (req: Request, res: Response) => {
    const [error, getReservationsDto] = GetReservationsDto.create(req.query);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(
      this.reservationService.getReservations(getReservationsDto!)
    )
      .then((reservations) => res.status(200).json(reservations))
      .catch((error) => this.handleResponseError(res, error));
  };

  public trashReservation = (req: Request, res: Response) => {
    const [error, trashDto] = TrashDto.create({
      ...req.body,
      id: req.params.id,
    });

    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.reservationService.trashReservation(trashDto!))
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public restoreReservation = (req: Request, res: Response) => {
    this.handleError(this.reservationService.restoreReservation(+req.params.id))
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getStadistics = (req: Request, res: Response) => {
    const [error, getStadisticsDto] = GetStadisticsDto.create(req.query);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.reservationService.getStadistics(getStadisticsDto!))
      .then((stadistics) => res.status(200).json(stadistics))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getStats = (req: Request, res: Response) => {
    this.handleError(this.reservationService.getStats())
      .then((stats) => res.status(200).json(stats))
      .catch((error) => this.handleResponseError(res, error));
  };
}
