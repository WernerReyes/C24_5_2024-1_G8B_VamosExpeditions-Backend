import { AppController } from "../controller";
import { CustomError } from "@/domain/error";
import { Request, Response } from "express";

import {
  GetReservationsDto,
  TripDetailsDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import { TripDetailsService } from "./tripDetails.service";

export class TripDetailsController extends AppController {
  constructor(
    private tripDetailsService: TripDetailsService) {
    super();
  }
  public upsertTripDetails = (req: Request, res: Response) => {
    const [error, upsertTripDetailsDto] = TripDetailsDto.create({
      ...req.body,
      id: req.params.id,
    });

    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.tripDetailsService.upsertTripDetails(upsertTripDetailsDto!)
    )
      .then((tripDetails) => res.status(200).json(tripDetails))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getTripDetailsById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.handleError(this.tripDetailsService.getTripDetailsById(+id))
      .then((tripDetails) => res.status(200).json(tripDetails))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getTripDetailsPdf = (req: Request, res: Response) => {
    const { id } = req.params;
    
    this.handleError(this.tripDetailsService.generatePdf(+id))
      .then((pdf) => {res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition",`attachment; filename=tripDetails.pdf`);
        pdf.pipe(res);
        pdf.end();
      })
      .catch((error) => this.handleResponseError(res, error));
  };


  public getAllTripDetailsPdf = (req: Request, res: Response) => {
    this.handleError(this.tripDetailsService.getAll())
      .then((pdf) => res.status(200).json(pdf))
      .catch((error) => this.handleResponseError(res, error));
  };
}
