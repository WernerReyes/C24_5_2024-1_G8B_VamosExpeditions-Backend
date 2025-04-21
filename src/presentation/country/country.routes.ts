import { Router } from "express";
import { Middleware } from "../middleware";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";


export class CountryRoutes {
  static get routes(): Router {
    const router = Router();

/*     router.use(Middleware.validateToken); */

    const countryService = new CountryService();
    const countryController = new CountryController(countryService);

    router.get("", countryController.getAllCountries);
    router.get("/distrit", countryController.getAllDistritAnd);

    return router;
  }
}
