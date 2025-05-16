import { CountryDto } from "@/domain/dtos/country/county.dto";
import { AppController } from "../controller";
import { CountryService } from "./country.service";
import { Request, Response } from "express";

export class CountryController extends AppController {
  constructor(private readonly countryService: CountryService) {
    super();
  }

  public getAllCountries = async (req: Request, res: Response) => {
    this.handleError(this.countryService.getAllCountries())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };


  public getAllDistritAnd = async (req: Request, res: Response) => {
    this.handleError(this.countryService.getAllDistritAnd())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getAllCityAndCountryAndDistrit = async (
    req: Request,
    res: Response
  ) => {
    this.handleError(this.countryService.getAllCityAndCountryAndDistrit())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };

  public fetchOnlyCountries = (req: Request, res: Response) => {
    this.handleError(this.countryService.fetchOnlyCountries())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };

  // start create  update and delete
  public upsertCountry = (req: Request, res: Response) => {
    const [error, country] = CountryDto.create({
      ...req.body,
      countryId: req.params.id,
    });
    if (error) return this.handleResponseError(res, error);

    this.handleError(this.countryService.upsertCountry(country!))
      .then((country) => res.status(200).json(country))
      .catch((error) => this.handleResponseError(res, error));
  };

  public deleteCountry = (req: Request, res: Response) => {
    const countryId = req.params.id;
    this.handleError(this.countryService.deleteCountry(+countryId))
      .then((country) => res.status(200).json(country))
      .catch((error) => this.handleResponseError(res, error));
  };




}
