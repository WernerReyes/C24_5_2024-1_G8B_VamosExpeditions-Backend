import { Router } from "express";
import { QuotationMapper } from "./quotation.mapper";
import { QuotationResponse } from "./quotation.response";
import { QuotationService } from "./quotation.service";
import { QuotationController } from "./quotation.controller";
import { Middleware } from "../middleware";

export class QuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const quotationMapper = new QuotationMapper();
    const quotationResponse = new QuotationResponse();
    const quotationService = new QuotationService(
      quotationMapper,
      quotationResponse
    );
    const quotationController = new QuotationController(quotationService);

    router.use(Middleware.validateToken);
    
    router.post("", quotationController.createQuotation);
    router.get("", quotationController.getQuotations);

    return router;
  }
}
