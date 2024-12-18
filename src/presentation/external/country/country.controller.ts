import type { Request, Response } from "express";
import { AppController } from "@/presentation/controller";
import { ExternalCountryService } from "./country.service";

export class ExternalCountryController extends AppController {
  constructor(private readonly externalCountryService: ExternalCountryService) {
    super();
  }

  public getAll = async (req: Request, res: Response) => {
    this.externalCountryService
      .getCountryList()
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleError(res, error));
  };
}
