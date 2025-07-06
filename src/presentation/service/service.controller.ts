import type { Request, Response } from "express";
import { GetServicesDto, ServiceDto } from "@/domain/dtos";
import { AppController } from "../controller";
import type { ServiceService } from "./service.service";
import { CustomError } from "@/domain/error";

export class ServiceController extends AppController {
  constructor(private readonly serviceService: ServiceService) {
    super();
  }

  public getAll = (req: Request, res: Response) => {
    const [error, getServicesDto] = GetServicesDto.create(req.query);
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    this.handleError(this.serviceService.getAll(getServicesDto!))
      .then((services) => res.status(200).json(services))
      .catch((error) => this.handleResponseError(res, error));
  };


  public upsertService = async (req: Request, res: Response) => {
      const [error, clientDto] = ServiceDto.create({
        ...req.body,
        id: req.params.id,
      });
      if (error)
        return this.handleResponseError(res, CustomError.badRequest(error));
  
      this.handleError(this.serviceService.upsertService(clientDto!))
        .then((client) => res.status(200).json(client))
        .catch((error) => this.handleResponseError(res, error));
    };
}
