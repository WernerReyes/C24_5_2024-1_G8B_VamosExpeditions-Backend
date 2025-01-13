import { Router } from "express";
import { Middleware } from "../middleware";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
import { CountryResponse } from "./country.response";

export class CountryRoutes {
  static get routes(): Router {
    const router = Router();

    router.use(Middleware.validateToken);
    const countryResponse = new CountryResponse();
    const countryService = new CountryService(countryResponse);
    const countryController = new CountryController(countryService);

    router.get("", countryController.getAllCountries);

    return router;
  }
}
