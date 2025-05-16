import { Router } from "express";
import { Middleware } from "../middleware";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
import { CountryMapper } from "./country.mapper";

export class CountryRoutes {
  static get routes(): Router {
    const router = Router();

    const countryMapper = new CountryMapper();
    const countryService = new CountryService(countryMapper);
    const countryController = new CountryController(countryService);

    router.use(Middleware.validateToken);

    router.get("", countryController.getAllCountries);
    router.get("/distrit", countryController.getAllDistritAnd);
    router.get(
      "/country-city-distrit",
      countryController.getAllCityAndCountryAndDistrit
    );
    router.get("/all-country", countryController.fetchOnlyCountries);

    // start create, update and delete
    router.post("", countryController.upsertCountry);
    router.put("/:id", countryController.upsertCountry);
    router.delete("/:id", countryController.deleteCountry);
    // end create, update and delete

    return router;
  }
}
