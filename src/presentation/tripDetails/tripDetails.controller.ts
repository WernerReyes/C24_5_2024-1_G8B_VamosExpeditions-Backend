import { CustomError } from "@/domain/error";
import { Request, Response } from "express";
import { AppController } from "../controller";

import {
  TripDetailsDto
} from "@/domain/dtos";
import type { TripDetailsService } from "./tripDetails.service";

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

}
