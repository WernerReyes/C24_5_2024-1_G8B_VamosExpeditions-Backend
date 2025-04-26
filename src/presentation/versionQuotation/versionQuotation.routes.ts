import { Router } from "express";
import { Middleware, type RequestAuth } from "../middleware";
import { VersionQuotationController } from "./versionQuotation.controller";
import { VersionQuotationMailer } from "./versionQuotation.mailer";
import { VersionQuotationMapper } from "./versionQuotation.mapper";
import { VersionQuotationReport } from "./versionQuotation.report";
import { VersionQuotationService } from "./versionQuotation.service";

export class VersionQuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const versionQuotationMapper = new VersionQuotationMapper();
    const versionQuotationReport = new VersionQuotationReport();
    const versionQuotationMailer = new VersionQuotationMailer();

    const versionQuotationService = new VersionQuotationService(
      versionQuotationMapper,
      versionQuotationReport,
      versionQuotationMailer
    );
    const versionQuotationController = new VersionQuotationController(
      versionQuotationService
    );

    router.use(Middleware.validateToken);

    router.get("/", versionQuotationController.getVersionQuotations);

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

    router.post(
      "/send-email-pdf",
      versionQuotationController.sendEmailAndGenerateReport
    );

    return router;
  }
}
