import type { Request, Response } from "express";
import { AppController } from "../controller";
import { QuotationService } from "./quotation.service";
import { CustomError } from "@/domain/error";
import { Reportdto } from "../../domain/dtos/report/report.dto";
import type { RequestAuth } from "../middleware";

export class QuotationController extends AppController {
  constructor(private readonly quotationService: QuotationService) {
    super();
  }

  public createQuotation = async (req: RequestAuth, res: Response) => {
    

    this.handleError(this.quotationService.createQuotation(+req.user.id))
      .then((quotation) => res.status(201).json(quotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getQuotations = async (req: Request, res: Response) => {
    this.handleError(this.quotationService.getQuotations())
      .then((quotations) => res.status(200).json(quotations))
      .catch((error) => this.handleResponseError(res, error));
  };

  public sendEmailPdf = async (req: Request, res: Response) => {
    
    const [error, reportdto] = Reportdto.create(req.body);
    if (error){
      return this.handleResponseError(res, CustomError.badRequest(error));
    }
    this.handleError(this.quotationService.sendEmailAndPdf(reportdto!))
      .then((report) => res.status(200).json(report))
      .catch((error) => this.handleResponseError(res, error));
  };
}
