import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Middleware } from "../middleware";

export class UserRoutes {
  public static get routes(): Router {
    const router = Router();
   
    const userService = new UserService();
    const userController = new UserController(
        userService
    );

    router.use([Middleware.validateToken]);

    router.get("/", userController.getUsers);

    return router;
  }
}
