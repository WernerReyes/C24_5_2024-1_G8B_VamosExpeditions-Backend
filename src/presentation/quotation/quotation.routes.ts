import { Router } from "express";
import { QuotationMapper } from "./quotation.mapper";
import { QuotationResponse } from "./quotation.response";
import { QuotationService } from "./quotation.service";
import { QuotationController } from "./quotation.controller";
import { Middleware } from "../middleware";
import {
  CloudinaryService,
  ContextStrategy,
  EmailService,
  EmailStrategy,
  PdfService,
} from "@/lib";

export class QuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService();
    const pdfService = new PdfService();
    const cloudinaryService = new CloudinaryService();

    const emailStrategy = new EmailStrategy(
      emailService,
      pdfService,
      cloudinaryService
    );
    const quotationMapper = new QuotationMapper();
    const quotationResponse = new QuotationResponse();

    const contextStrategy = new ContextStrategy(emailStrategy);
    const quotationService = new QuotationService(
      quotationMapper,
      quotationResponse,
      contextStrategy
    );
    const quotationController = new QuotationController(quotationService);

    /* router.use(Middleware.validateToken); */

    router.post("", quotationController.createQuotation);
    router.get("", quotationController.getQuotations);
    router.post("/send-email-pdf", quotationController.sendEmailPdf);

    return router;
  }
}
