import type { Request, Response } from "express";
import { InsertManyServiceTripDetailsDto } from "@/domain/dtos";
import { AppController } from "../controller";
import type { ServiceTripDetailsService } from "./serviceTripDetails.service";
import { CustomError } from "@/domain/error";

export class ServiceTripDetailsController extends AppController {
  constructor(private readonly serviceTripDetailsService: ServiceTripDetailsService) {
    super();
  }

  public insertMany = (req: Request, res: Response) => {
    const [error, insertManyServiceTripDetailsDto] = InsertManyServiceTripDetailsDto.create(req.body);
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    this.handleError(this.serviceTripDetailsService.insertMany(insertManyServiceTripDetailsDto!))
      .then((serviceTripDetails) => res.status(201).json(serviceTripDetails))
      .catch((error) => this.handleResponseError(res, error));
  };
}