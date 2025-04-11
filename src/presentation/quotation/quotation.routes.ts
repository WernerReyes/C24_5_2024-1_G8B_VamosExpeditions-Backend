import { Router } from "express";
import { QuotationMapper } from "./quotation.mapper";
import { QuotationService } from "./quotation.service";
import { QuotationController } from "./quotation.controller";
import { Middleware, type RequestAuth } from "../middleware";

export class QuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const quotationMapper = new QuotationMapper();

    const quotationService = new QuotationService(quotationMapper);
    const quotationController = new QuotationController(quotationService);

    router.use(Middleware.validateToken);

    router.post("", (req, res) =>
      quotationController.createQuotation(req as RequestAuth, res)
    );
   
    return router;
  }
}
