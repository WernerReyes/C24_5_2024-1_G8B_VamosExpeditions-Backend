import { Router } from "express";
import { ExternalCountryController } from "./country.controller";
import { ExternalCountryResponse } from "./country.response";
import { ExternalCountryService } from "./country.service";
import { Middleware } from "@/presentation/middleware";

export class ExternalCountryRoutes {
  static get routes(): Router {
    const router = Router();

    const externalCountryResponse = new ExternalCountryResponse();
    const externalCountryService = new ExternalCountryService(
      externalCountryResponse
    );
    const externalCountryController = new ExternalCountryController(
      externalCountryService
    );

    router.use(Middleware.validateToken);

    router.get("/", externalCountryController.getAll);
    router.get("/:code", externalCountryController.getByCode);

    return router;
  }
}
