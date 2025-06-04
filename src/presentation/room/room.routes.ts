import { Router } from "express";
import { Middleware } from "../middleware";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { RoomMapper } from "./room.mapper";

export class RoomRoutes {
  public static get routes(): Router {
    const router = Router();

    router.use([Middleware.validateToken]);

    const roomMapper =  new RoomMapper();
    const roomService = new RoomService(roomMapper);
    const roomController = new RoomController(roomService);

   //! start create, update and delete
    router.post("/", roomController.upsertRoom);
    router.put("/:id", roomController.upsertRoom);
    router.put("/:id/trash", roomController.trashRoom);
    router.put("/:id/restore", roomController.restoreRoom);
    //! end create, update and delete


    return router;
  }
}
