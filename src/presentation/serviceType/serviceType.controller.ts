import type { Request, Response } from "express";
import { GetServiceTypesDto } from "@/domain/dtos";
import { AppController } from "../controller";
import type { ServiceTypeService } from "./serviceType.service";
import { CustomError } from "@/domain/error";

export class ServiceTypeController extends AppController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {
    super();
  }

  public getAll = (req: Request, res: Response) => {
    const [error, getServiceTypesDto] = GetServiceTypesDto.create(req.query);
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    this.handleError(this.serviceTypeService.getAll(getServiceTypesDto!))
      .then((serviceTypes) => res.status(200).json(serviceTypes))
      .catch((error) => this.handleResponseError(res, error));
  };

  // public create = (req: Request, res: Response) => {
  //   const [error, serviceTypeDto] = ServiceTypeDto.create(req.body);
  //   if (error) {
  //     return this.handleResponseError(res, CustomError.badRequest(error));
  //   }

  //   this.handleError(this.serviceTypeService.create(serviceTypeDto!))
  //     .then((serviceType) => res.status(201).json(serviceType))
  //     .catch((error) => this.handleResponseError(res, error));
  // };

  // public update = (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const [error, serviceTypeDto] = ServiceTypeDto.create(req.body);
  //   if (error) {
  //     return this.handleResponseError(res, CustomError.badRequest(error));
  //   }

  //   this.handleError(this.serviceTypeService.update(+id, serviceTypeDto!))
  //     .then((serviceType) => res.status(200).json(serviceType))
  //     .catch((error) => this.handleResponseError(res, error));
  // };
}