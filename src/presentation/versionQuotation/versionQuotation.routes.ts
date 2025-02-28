import { Router } from "express";
import { Middleware, type RequestAuth } from "../middleware";
import { VersionQuotationMapper } from "./versionQuotation.mapper";
import { VersionQuotationService } from "./versionQuotation.service";
import { VersionQuotationController } from "./versionQuotation.controller";

export class VersionQuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const versionQuotationMapper = new VersionQuotationMapper();
    const versionQuotationService = new VersionQuotationService(
      versionQuotationMapper
    );
    const versionQuotationController = new VersionQuotationController(
      versionQuotationService
    );

    router.use(Middleware.validateToken);

    router.get("/", versionQuotationController.getVersionsQuotation);
    router.put("", versionQuotationController.updateVersionQuotation);
    router.put(
      "/official",
      versionQuotationController.updateOfficialVersionQuotation
    );
    router.post("/duplicate-multiple", (req, res) =>
      versionQuotationController.duplicateMultipleVersionQuotation(
        req as RequestAuth,
        res
      )
    );
    router.get(
      "/:quotationId/:versionNumber",
      versionQuotationController.getVersionsQuotationById
    );

    return router;
  }
}
