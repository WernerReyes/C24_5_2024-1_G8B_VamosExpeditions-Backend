import type { Request, Response } from "express";
import { AppController } from "../controller";
import type { RequestAuth } from "../middleware";
import { QuotationService } from "./quotation.service";

export class QuotationController extends AppController {
  constructor(private readonly quotationService: QuotationService) {
    super();
  }

  public createQuotation = async (req: RequestAuth, res: Response) => {
    

    this.handleError(this.quotationService.createQuotation(+req.user.id))
      .then((quotation) => res.status(201).json(quotation))
      .catch((error) => this.handleResponseError(res, error));
  };

  
}
