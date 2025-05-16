import { AppController } from "../controller";
import { DistritService } from "./distrit.service";
import { Request, Response } from "express";
import { DistritDto } from '../../domain/dtos/distrit/distrit.dto';

export class DistritController extends AppController {
  constructor(private readonly distritService:DistritService ) {
    super();
}



  public getAllDistrit = async (req: Request, res: Response) => {
 
    this.handleError(this.distritService.getAllDistrit())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  }

  // start create, update and delete
  public upsertDistrit = async (req: Request, res: Response) => {

    const [error, distrit] = DistritDto.create({
      ...req.body,
      distritId: req.params.id,
    });
    if (error) return this.handleResponseError(res, error);

    this.handleError(this.distritService.upsertDistrit(distrit!))
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };
  // end create, update and delete

}