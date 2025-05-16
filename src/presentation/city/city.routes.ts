import { Router } from "express";
import { Middleware } from "../middleware";
import { CityController } from "./city.controller";
import { CityService } from "./city.service";
import { CityMapper } from "./city.mapper";


export class CityRoutes {
  
   static get routes(): Router {
    const router = Router();
    router.use([Middleware.validateToken]);

    const cityMapper = new CityMapper();
    const cityService = new CityService(cityMapper);
    const cityController = new CityController(cityService);
    router.get("/all-city", cityController.getCitiesAlls);
    
   // start create, update and delete
      router.post("", cityController.upsertCity);
      router.put("/:id", cityController.upsertCity);
   // end create, update and delete

    return router;
    
   }  
}