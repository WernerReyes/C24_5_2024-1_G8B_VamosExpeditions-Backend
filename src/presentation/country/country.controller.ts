import { AppController } from "../controller";
import { CountryService } from "./country.service";
import { Request, Response } from "express";

export class CountryController extends AppController {
  constructor(private readonly countryService: CountryService) {
    super();
  }

  public getAllCountries = async (req: Request, res: Response) => {
    this.countryService
      .getAllCountries()
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleError(res, error));
  };
}
