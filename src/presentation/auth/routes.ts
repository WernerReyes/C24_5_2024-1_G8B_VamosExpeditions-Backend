import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    // router.post("/login", AuthController.login);
    // router.post("/register", AuthController.register);

    return router;
  }
}
