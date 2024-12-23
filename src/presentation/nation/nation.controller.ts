import { AppController } from "../controller";
import { NationService } from "./nation.service";
import { Request, Response } from "express";

export class NationController extends AppController {
  constructor(private readonly nationService: NationService) {
    super();
  }

  public getAllNations = async (req: Request, res: Response) => {
    this.nationService
      .getAllNations()
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleError(res, error));
  };
}
