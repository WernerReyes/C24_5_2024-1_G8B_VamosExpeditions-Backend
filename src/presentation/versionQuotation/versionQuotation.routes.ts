import { Router } from "express";
import { Middleware } from "../middleware";
import { VersionQuotationMapper } from "./versionQuotation.mapper";
import { VersionQuotationResponse } from "./versionQuotation.response";
import { VersionQuotationService } from "./versionQuotation.service";
import { VersionQuotationController } from "./versionQuotation.controller";

export class VersionQuotationRoutes {
  static get routes(): Router {
    const router = Router();

    const versionQuotationMapper = new VersionQuotationMapper();
    const versionQuotationResponse = new VersionQuotationResponse();
    const versionQuotationService = new VersionQuotationService(
      versionQuotationMapper,
      versionQuotationResponse
    );
    const versionQuotationController = new VersionQuotationController(
      versionQuotationService
    );

    router.use(Middleware.validateToken);

    router.get("/", versionQuotationController.getVersionsQuotation);
    router.put("", versionQuotationController.updateVersionQuotation);
    router.post(
      "/duplicate",
      versionQuotationController.duplicateVersionQuotation
    );
    router.get(
      "/:quotationId/:versionNumber",
      versionQuotationController.getVersionsQuotationById
    );

    return router;
  }
}
