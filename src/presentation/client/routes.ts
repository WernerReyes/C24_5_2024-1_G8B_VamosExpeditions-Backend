import { Router } from "express";
import { ClientController } from "./controller";
import { ClientResponse, ClientService } from "../services/client";



export class ClientRoutes{
    static get routes(): Router {
        const router = Router();
       
        const clientResponse= new ClientResponse();
        const clientService = new ClientService(clientResponse);
        const clientController = new ClientController(clientService);
      
        router.post("/register", clientController.registerClient);
        router.get("", clientController.getClientsAlls);
    
        return router;
      }
}