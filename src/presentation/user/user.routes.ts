import { type RequestHandler, Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Middleware } from "../middleware";
import { UserMapper } from "./user.mapper";
import { RoleEnum } from "@/infrastructure/models";

export class UserRoutes {
  public static get routes(): Router {
    const router = Router();

    const userMapper = new UserMapper();
    const userService = new UserService(userMapper);
    const userController = new UserController(userService);

    router.use([Middleware.validateToken]);

    router.get("/", userController.getUsers);

    router.post("/", [
      Middleware.validateActionPermission([
        RoleEnum.MANAGER_ROLE,
      ]) as RequestHandler,
      userController.upsertUser,
    ]);

    router.put(
      "/:id",
      Middleware.validateOwnership as RequestHandler,
      userController.upsertUser
    );
    router.put(
      "/:id/change-password",
      Middleware.validateOwnership as RequestHandler,
      userController.changePassword
    );

    return router;
  }
}
