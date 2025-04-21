import {
  ArchiveVersionQuotationDto,
  DuplicateMultipleVersionQuotationDto,
  GetVersionQuotationsDto,
  SendEmailAndGenerateReportDto,
  VersionQuotationDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import type { Request, Response } from "express";
import { AppController } from "../controller";
import type { RequestAuth } from "../middleware";
import { VersionQuotationService } from "./versionQuotation.service";

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

  public cancelAndReplaceApprovedOfficialVersionQuotation = async (
    req: Request,
    res: Response
  ) => {
    const [error, versionQuotationIDDto] = VersionQuotationIDDto.create(
      req.body
    );
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.cancelAndReplaceApprovedOfficialVersionQuotation(
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

  public archiveVersionQuotation = async (req: Request, res: Response) => {
    const [error, archiveVersionQuotationDto] =
      ArchiveVersionQuotationDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.archiveVersionQuotation(
        archiveVersionQuotationDto!
      )
    )
      .then((versionQuotation) => res.status(200).json(versionQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public unArchiveVersionQuotation = async (req: Request, res: Response) => {
    const [error, versionQuotationIDDto] = VersionQuotationIDDto.create(
      req.body
    );
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.unArchiveVersionQuotation(versionQuotationIDDto!)
    )
      .then((versionQuotation) => res.status(200).json(versionQuotation))
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

  public getVersionQuotations = async (req: Request, res: Response) => {
    const [error, getVersionQuotationsDto] = GetVersionQuotationsDto.create(
      req.query
    );
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.getVersionsQuotation(
        getVersionQuotationsDto!
      )
    )
      .then((versionsQuotation) => res.status(200).json(versionsQuotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public generatePdf = async (req: Request, res: Response) => {
    const [error, idDto] = VersionQuotationIDDto.create(req.params);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.versionQuotationService.generatePdf(idDto!))
      .then((pdf) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=tripDetails.pdf`
        );
        pdf.pipe(res);
        pdf.end();
      })
      .catch((error) => this.handleResponseError(res, error));
  };

  public sendEmailAndGenerateReport = async (req: Request, res: Response) => {
    const [error, reportDto] = SendEmailAndGenerateReportDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.versionQuotationService.sendEmailAndGenerateReport(reportDto!)
    )
      .then((report) => res.status(200).json(report))
      .catch((error) => this.handleResponseError(res, error));
  };
}
