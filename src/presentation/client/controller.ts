import { Request, Response } from "express";
import { AppController } from "../controller";
import { ClienDto } from "@/domain/dtos/client/client.dto";
import { ClientService } from "../services/client";
import { CustomError } from "@/domain/error";

export class ClientController extends AppController {
  constructor(private clientService: ClientService) {
    super();
  }

  public registerClient = async (req: Request, res: Response) => {
    const [error, createclientDto] = ClienDto.create(req.body);
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
