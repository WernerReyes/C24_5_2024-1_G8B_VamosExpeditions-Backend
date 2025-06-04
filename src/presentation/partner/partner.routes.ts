import { Router } from "express";
import { PartnerMapper } from "./partner.mapper";
import { PartnerService } from "./partner.service";
import { PartnerController } from "./partner.controller";
import { Middleware } from "../middleware";

export class PartnerRoutes {
  static get routes(): Router {
    const router = Router();
    const partnerMapper = new PartnerMapper();
    const partnerService = new PartnerService(partnerMapper);
    const partnerController = new PartnerController(partnerService);

    router.use(Middleware.validateToken);

    router.get("/partners-all", partnerController.getPartnersAll);
    router.post("", partnerController.upsertPartner);
    router.put("/:id", partnerController.upsertPartner);

    router.put("/:id/trash", partnerController.trashPartner);
    router.put("/:id/restore", partnerController.restorePartner);
    return router;
  }
}
