import type { Request, Response } from "express";
import {
  DuplicateMultipleVersionQuotationDto,
  VersionQuotationDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import { AppController } from "../controller";
import { VersionQuotationService } from "./versionQuotation.service";
import { CustomError } from "@/domain/error";
import type { RequestAuth } from "../middleware";

export class VersionQuotationController extends AppController {
  constructor(
    private readonly versionQuotationService: VersionQuotationService
  ) {
    super();
  }

  public updateVersionQuotation = async (req: Request, res: Response) => {
    const [error, versionQuotationDto] = VersionQuotationDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.updateVersionQuotation(versionQuotationDto!)
    )
      .then((versionQuotation) => res.status(200).json(versionQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public updateOfficialVersionQuotation = async (
    req: Request,
    res: Response
  ) => {
    const [error, versionQuotationIDDto] = VersionQuotationIDDto.create(
      req.body
    );
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.updateOfficialVersionQuotation(
        versionQuotationIDDto!
      )
    )
      .then((versionQuotation) => res.status(200).json(versionQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public duplicateMultipleVersionQuotation = async (
    req: RequestAuth,
    res: Response
  ) => {
    const [error, duplicateMultipleVersionQuotationDto] =
      DuplicateMultipleVersionQuotationDto.create({
        ids: req.body.ids,
        userId: req.user.id,
      });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.duplicateMultipleVersionQuotation(
        duplicateMultipleVersionQuotationDto!
      )
    )
      .then((versionQuotation) => res.status(201).json(versionQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getVersionsQuotationById = async (req: Request, res: Response) => {
    const id = {
      quotationId: Number(req.params.quotationId),
      versionNumber: Number(req.params.versionNumber),
    };
    this.handleError(this.versionQuotationService.getVersionQuotationById(id))
      .then((versionsQuotation) => res.status(200).json(versionsQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getVersionsQuotation = async (req: Request, res: Response) => {
    this.handleError(this.versionQuotationService.getVersionsQuotation())
      .then((versionsQuotation) => res.status(200).json(versionsQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };
}
