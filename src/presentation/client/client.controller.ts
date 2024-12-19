import { Request, Response } from "express";
import { AppController } from "../controller";
import { ClienDto } from "@/domain/dtos/client/client.dto";
import { CustomError } from "@/domain/error";
import { ClientService } from "./client.service";

export class ClientController extends AppController {
  constructor(private clientService: ClientService) {
    super();
  }

  public registerClient = async (req: Request, res: Response) => {

     console.log(req.body);
    const {country,fullName,email,phone} = req.body;
    

    const [error, createclientDto] = ClienDto.create({ country: country.name, fullName, email, phone });
    if (error) return this.handleError(res, CustomError.badRequest(error));

    this.clientService
      .registerClient(createclientDto!)
      .then((client) => res.status(201).json(client))
      .catch((error) => this.handleError(res, error));
  };

  public getClientsAlls = async (req: Request, res: Response) => {
    this.clientService
      .getClientsAlls()
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleError(res, error));
  };
}
