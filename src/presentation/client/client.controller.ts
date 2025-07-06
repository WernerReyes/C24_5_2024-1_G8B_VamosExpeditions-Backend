import { Request, Response } from "express";
import { AppController } from "../controller";
import { ClientDto } from "@/domain/dtos/client/client.dto";
import { CustomError } from "@/domain/error";
import { ClientService } from "./client.service";
import { GetClientsDto, TrashDto } from "@/domain/dtos";

export class ClientController extends AppController {
  constructor(private clientService: ClientService) {
    super();
  }

  public upsertClient = async (req: Request, res: Response) => {
    console.log("req.body", req.body);
    const [error, clientDto] = ClientDto.create({
      ...req.body,
      id: req.params.id,
    });
    console.log("ClientDto", clientDto);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.clientService.upsertClient(clientDto!))
      .then((client) => res.status(200).json(client))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getClientsAlls = async (req: Request, res: Response) => {
    this.handleError(this.clientService.getClientsAlls())
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getClients = (req: Request, res: Response) => {
    const [error, getClientDto] = GetClientsDto.create({
      ...req.query,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.clientService.getClients(getClientDto!))
      .then((clients) => res.status(200).json(clients))
      .catch((error) => this.handleResponseError(res, error));
  };

  public trashClient = (req: Request, res: Response) => {
    const [error, trashDto] = TrashDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.clientService.trashClient(trashDto!))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public restoreClient = (req: Request, res: Response) => {
    this.handleError(this.clientService.restoreClient(+req.params.id))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };
}
