import { Router } from "express";
import { Middleware } from "../middleware";
import { RoleMapper } from "./role.mapper";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";

export class RoleRoutes {
  static get routes(): Router {
    const router = Router();

    const roleMapper = new RoleMapper();
    const roleService = new RoleService(roleMapper);
    const roleController = new RoleController(roleService);

    router.use(Middleware.validateToken);

    router.get(
      "/",
      roleController.getAll
    );

    return router;
  }
}
