import { AppController } from "../controller";
import { DistritService } from "./distrit.service";
import { Request, Response } from "express";

export class DistritController extends AppController {
  constructor(private readonly distritService:DistritService ) {
    super();
}



  public getAllDistrit = async (req: Request, res: Response) => {
 
    this.handleError(this.distritService.getAllDistrit())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  }

}