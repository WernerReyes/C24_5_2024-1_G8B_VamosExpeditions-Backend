import { Router } from "express";
import { Middleware } from "../middleware";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { ClientMapper } from "./client.mapper";

export class ClientRoutes {
  static get routes(): Router {
    const router = Router();

    const clientMapper = new ClientMapper();
    const clientService = new ClientService(clientMapper);
    const clientController = new ClientController(clientService);

    router.use([Middleware.validateToken]);

    router.post("/", clientController.upsertClient);
    router.put("/:id", clientController.upsertClient);
    router.get("", clientController.getClientsAlls);

    return router;
  }
}
