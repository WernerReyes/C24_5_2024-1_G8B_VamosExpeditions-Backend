import {
  InsertManyDetailsTripDetailsDto,
  UpdateManyDetailsTripDetailsByDateDto,
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import type { Request, Response } from "express";
import { AppController } from "../controller";
import type { ServiceTripDetailsService } from "./serviceTripDetails.service";

export class ServiceTripDetailsController extends AppController {
  constructor(
    private readonly serviceTripDetailsService: ServiceTripDetailsService
  ) {
    super();
  }

  public insertMany = (req: Request, res: Response) => {
    const [error, insertManyServiceTripDetailsDto] =
      InsertManyDetailsTripDetailsDto.create(req.body);
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    this.handleError(
      this.serviceTripDetailsService.insertMany(
        insertManyServiceTripDetailsDto!
      )
    )
      .then((serviceTripDetails) => res.status(201).json(serviceTripDetails))
      .catch((error) => this.handleResponseError(res, error));
  };

  public updateManyByDate = (req: Request, res: Response) => {
    const [error, updateManyServiceTripDetailsByDateDto] =
      UpdateManyDetailsTripDetailsByDateDto.create(req.body);

    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    this.handleError(
      this.serviceTripDetailsService.updateManyByDate(
        updateManyServiceTripDetailsByDateDto!
      )
    )
      .then((serviceTripDetails) => res.status(200).json(serviceTripDetails))
      .catch((error) => this.handleResponseError(res, error));
  };

  public deleteById = async (req: Request, res: Response) => {
    
    const id = Number(req.params.id);
    if (isNaN(id))
      return this.handleResponseError(
        res,
        CustomError.badRequest("id must be a number")
      );
    this.handleError(this.serviceTripDetailsService.deleteById(id))
      .then((message) => res.status(200).json(message))
      .catch((error) => this.handleResponseError(res, error));
  };

  public deleteMany = async (req: Request, res: Response) => {
    const ids = Array.isArray(req.body.ids);
    if (!ids)
      return this.handleResponseError(
        res,
        CustomError.badRequest("ids must be an array")
      );
    this.handleError(this.serviceTripDetailsService.deleteMany(req.body.ids))
      .then((message) => res.status(200).json(message))
      .catch((error) => this.handleResponseError(res, error));
  };
}
