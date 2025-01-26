import type { Request, Response } from "express";
import { AppController } from "../controller";
import { QuotationService } from "./quotation.service";
import { CustomError } from "@/domain/error";

export class QuotationController extends AppController {
  constructor(private readonly quotationService: QuotationService) {
    super();
  }

  public createQuotation = async (req: Request, res: Response) => {
    const userId = req.body.user.id;
    this.quotationService
      .createQuotation(userId)
      .then((quotation) => res.status(201).json(quotation))
      .catch((error) => this.handleError(res, error));
  };

  public getQuotations = async (req: Request, res: Response) => {
    this.quotationService
      .getQuotations()
      .then((quotations) => res.status(200).json(quotations))
      .catch((error) => this.handleError(res, error));
  };

}
