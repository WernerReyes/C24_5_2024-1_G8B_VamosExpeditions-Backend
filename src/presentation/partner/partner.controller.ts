import { CustomError } from "@/domain/error";
import { AppController } from "../controller";
import { PartnerService } from "./partner.service";
import { Request, Response } from "express";
import { GetPartnersDto, PartnerDto, TrashDto } from "@/domain/dtos";

export class PartnerController extends AppController {
  constructor(private readonly partnerService: PartnerService) {
    super();
  }

  public getPartnersAll = async (req: Request, res: Response) => {
    const [error, getPartnersDto] = GetPartnersDto.create({
      ...req.query,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.partnerService.getPartnersAll(getPartnersDto!))
      .then((partners) => res.status(200).json(partners))
      .catch((error) => this.handleResponseError(res, error));
  };

  public upsertPartner = async (req: Request, res: Response) => {
    const [error, partnerDto] = PartnerDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.partnerService.upsertPartner(partnerDto!))
      .then((partner) => res.status(200).json(partner))
      .catch((error) => this.handleResponseError(res, error));
  };



  public trashPartner = (req: Request, res: Response) => {
  const [error, trashDto] = TrashDto.create({
    ...req.body,
    id: req.params.id,
  });
  if (error)
    return this.handleResponseError(res, CustomError.badRequest(error));
  this.handleError(this.partnerService.trashPartner(trashDto!))
    .then((response) => res.status(200).json(response))
    .catch((error) => this.handleResponseError(res, error));
};

public restorePartner = (req: Request, res: Response) => {
  this.handleError(this.partnerService.restorePartner(+req.params.id))
    .then((response) => res.status(200).json(response))
    .catch((error) => this.handleResponseError(res, error));
};

}
