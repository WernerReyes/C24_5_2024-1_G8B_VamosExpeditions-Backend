import { Router } from "express";
import { ClientController } from "./controller";
import { ClientResponse, ClientService } from "../services/client";
import { Middleware } from "../middleware";



export class ClientRoutes{
    static get routes(): Router {
        const router = Router();
       
        const clientResponse= new ClientResponse();
        const clientService = new ClientService(clientResponse);
        const clientController = new ClientController(clientService);

        router.use([Middleware.validateToken]);
      
        router.post("/register", clientController.registerClient);
        router.get("", clientController.getClientsAlls);
    
        return router;
      }
}