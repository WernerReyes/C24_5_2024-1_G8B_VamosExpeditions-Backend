import { Router } from "express";
import { DistritService } from "./distrit.service";
import { DistritController } from "./distrit.controller";

export class DistritRoutes {
    static get routes(): Router {
      const router = Router();
  
       /*  router.use(Middleware.validateToken); */
       const distritService = new DistritService();
        const distritController = new DistritController(distritService);
  
      router.get("", distritController.getAllDistrit);
      return router;
    }
  }