import { Router } from "express";
import { Middleware, type RequestAuth } from "../middleware";
import { VersionQuotationMapper } from "./versionQuotation.mapper";
import { VersionQuotationService } from "./versionQuotation.service";
import { VersionQuotationController } from "./versionQuotation.controller";
import { VersionQuotationReport } from "./versionQuotation.report";
import { EmailService, PdfService } from "@/lib";

export class VersionQuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const versionQuotationMapper = new VersionQuotationMapper();
    const versionQuotationReport = new VersionQuotationReport();
    const pdfService = new PdfService();
    const emailService = new EmailService();
    
    const versionQuotationService = new VersionQuotationService(
      versionQuotationMapper,
      versionQuotationReport,
      pdfService,
      emailService,
    );
    const versionQuotationController = new VersionQuotationController(
      versionQuotationService
    );

    router.use(Middleware.validateToken);

    router.get("/", versionQuotationController.getVersionQuotations);

    router.get(
      "/drafts",
      versionQuotationController.getTotalDraftsVersionQuotation
    );

    router.get(
      "/pdf/:quotationId/:versionNumber",
      versionQuotationController.generatePdf
    );

    router.put("", versionQuotationController.updateVersionQuotation);
    router.put(
      "/official",
      versionQuotationController.updateOfficialVersionQuotation
    );
    router.put(
      "/cancel-replace",
      versionQuotationController.cancelAndReplaceApprovedOfficialVersionQuotation
    );
    router.post("/duplicate-multiple", (req, res) =>
      versionQuotationController.duplicateMultipleVersionQuotation(
        req as RequestAuth,
        res
      )
    );

    router.put("/archive", versionQuotationController.archiveVersionQuotation);

    router.put(
      "/unarchive",
      versionQuotationController.unArchiveVersionQuotation
    );

    router.get(
      "/:quotationId/:versionNumber",
      versionQuotationController.getVersionsQuotationById
    );


     router.post("/send-email-pdf", versionQuotationController.sendEmailAndGenerateReport);


    return router;
  }
}
