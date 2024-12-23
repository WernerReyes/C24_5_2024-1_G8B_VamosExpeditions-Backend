import { Router } from "express";
import { Middleware } from "../middleware";
import { ClientController } from "./client.controller";
import { ClientResponse } from "./client.response";
import { ClientService } from "./client.service";

export class ClientRoutes {
  static get routes(): Router {
    const router = Router();

    const clientResponse = new ClientResponse();
    const clientService = new ClientService(clientResponse);
    const clientController = new ClientController(clientService);

    /* router.use([Middleware.validateToken]); */

    router.post("/register", clientController.registerClient);
    router.get("", clientController.getClientsAlls);

    return router;
  }
}
