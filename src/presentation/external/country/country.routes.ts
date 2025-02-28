import { Router } from "express";
import { ExternalCountryController } from "./country.controller";
import { ExternalCountryService } from "./country.service";
import { Middleware } from "@/presentation/middleware";

export class ExternalCountryRoutes {
  static get routes(): Router {
    const router = Router();

    const externalCountryService = new ExternalCountryService();
    const externalCountryController = new ExternalCountryController(
      externalCountryService
    );

    router.use(Middleware.validateToken);

    router.get("/", externalCountryController.getAll);
  
    return router;
  }
}
