import type { Request, Response } from "express";
import {
  DuplicateVersionQuotationDto,
  VersionQuotationDto,
} from "@/domain/dtos";
import { AppController } from "../controller";
import { VersionQuotationService } from "./versionQuotation.service";
import { CustomError } from "@/domain/error";

export class VersionQuotationController extends AppController {
  constructor(
    private readonly versionQuotationService: VersionQuotationService
  ) {
    super();
  }

  public updateVersionQuotation = async (req: Request, res: Response) => {
    const [error, versionQuotationDto] = VersionQuotationDto.create(req.body);
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.versionQuotationService
      .updateVersionQuotation(versionQuotationDto!)
      .then((versionQuotation) => res.status(200).json(versionQuotation))
      .catch((error) => this.handleError(res, error));
  };

  public duplicateVersionQuotation = async (req: Request, res: Response) => {
    const [error, duplicateVersionQuotationDto] =
      DuplicateVersionQuotationDto.create({
        ...req.body,
        userId: req.body.user.id,
      });
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.versionQuotationService
      .duplicateVersionQuotation(duplicateVersionQuotationDto!)
      .then((versionQuotation) => res.status(201).json(versionQuotation))
      .catch((error) => this.handleError(res, error));
  };

  public getVersionsQuotationById = async (req: Request, res: Response) => {
    const id = {
      quotationId: Number(req.params.quotationId),
      versionNumber: Number(req.params.versionNumber),
    };
    this.versionQuotationService
      .getVersionQuotationById(id)
      .then((versionsQuotation) => res.status(200).json(versionsQuotation))
      .catch((error) => this.handleError(res, error));
  };

  public getVersionsQuotation = async (req: Request, res: Response) => {
    this.versionQuotationService
      .getVersionsQuotation()
      .then((versionsQuotation) => res.status(200).json(versionsQuotation))
      .catch((error) => this.handleError(res, error));
  }
}
