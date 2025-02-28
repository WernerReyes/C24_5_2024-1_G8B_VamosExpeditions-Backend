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
    if (error) return this.handleResponseError(res, CustomError.badRequest(error));

    this.reservationService
      .upsertReservation(upsertReservationDto!)
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getReservationById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.reservationService
      .getReservationById(+id)
      .then((reservation) => res.status(200).json(reservation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getReservations = (req: Request, res: Response) => {
    const [error, getReservationsDto] = GetReservationsDto.create(req.query);
    if (error) return this.handleResponseError(res, CustomError.badRequest(error));
    this.reservationService
      .getReservations(getReservationsDto!)
      .then((reservations) => res.status(200).json(reservations))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getReservationPdf = (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id", id);
    this.reservationService
      .generatePdf(+id)
      .then((pdf) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=reservation.pdf`
        );
        pdf.pipe(res);
        pdf.end();
      })
      .catch((error) => this.handleResponseError(res, error));
  };

  public getReservationallPdf = (req: Request, res: Response) => {
    this.reservationService
      .getall()
      .then((pdf) => res.status(200).json(pdf))
      .catch((error) => this.handleResponseError(res, error));
  };
}
