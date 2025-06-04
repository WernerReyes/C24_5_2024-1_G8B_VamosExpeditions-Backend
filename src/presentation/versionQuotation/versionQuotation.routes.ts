import { RequestHandler, Router } from "express";
import { Middleware, type RequestAuth } from "../middleware";
import { VersionQuotationController } from "./versionQuotation.controller";
import { VersionQuotationMailer } from "./versionQuotation.mailer";
import { VersionQuotationMapper } from "./versionQuotation.mapper";
import { VersionQuotationService } from "./versionQuotation.service";
import { VersionQuotationExcel } from "./versionQuotation.excel";
import { VersionQuotationPdf } from "./versionQuotation.pdf";

export class VersionQuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const versionQuotationMapper = new VersionQuotationMapper();

    const versionQuotationPdf = new VersionQuotationPdf();
    const versionQuotationMailer = new VersionQuotationMailer();

    const versionQuotationExcel = new VersionQuotationExcel();
    const versionQuotationService = new VersionQuotationService(
      versionQuotationMapper,
      versionQuotationMailer,
      versionQuotationExcel,
      versionQuotationPdf
    );
    const versionQuotationController = new VersionQuotationController(
      versionQuotationService
    );

    router.use(Middleware.validateToken);

    router.get("/", versionQuotationController.getVersionQuotations);

    // start excel and pdf routes
    router.get(
      "/pdf/:quotationId/:versionNumber",
      versionQuotationController.generatePdf
    );
    router.get(
      "/excel/:quotationId/:versionNumber",
      versionQuotationController.generateExcel
    );
    // end excel and pdf routes

    router.put(
      "/official",
      versionQuotationController.updateOfficialVersionQuotation
    );
    router.put(
      "/cancel-replace",
      versionQuotationController.cancelAndReplaceApprovedOfficialVersionQuotation
    );

    router.put(
      "/:userId",
      [Middleware.validateOwnership as RequestHandler],
      versionQuotationController.updateVersionQuotation
    );
    
    router.post("/duplicate-multiple", (req, res) =>
      versionQuotationController.duplicateMultipleVersionQuotation(
        req as RequestAuth,
        res
      )
    );

    router.put("/trash", versionQuotationController.trashVersionQuotation);

    router.put("/restore", versionQuotationController.restoreVersionQuotation);

    router.get(
      "/:quotationId/:versionNumber",
      versionQuotationController.getVersionsQuotationById
    );

    router.post(
      "/send-email-pdf",
      versionQuotationController.sendEmailAndGenerateReport
    );

    // router.post("/send-email-excel", versionQuotationController.sendEmailA);

    /* router.get("/prueba", versionQuotationController.getExcelQuotationById); */

    return router;
  }
}
