import { Router } from "express";
import { Middleware } from "../middleware";
import { AccommodationRoomResponse } from "./accommodationRoom.response";
import { AccommodationRoomService } from "./accommodationRoom.service";
import { AccommodationRoomController } from "./accommodationRoom.controller";

export class AccommodationRoomRoutes {
  static get routes(): Router {
    const router = Router();

    const accommodationRoomResponse = new AccommodationRoomResponse();
    const accommodationRoomService = new AccommodationRoomService(
      accommodationRoomResponse
    );
    const accommodationRoomController = new AccommodationRoomController(
      accommodationRoomService
    );

    router.use(Middleware.validateToken);

    router.get("/", accommodationRoomController.getAll);
    // router.get("/:id", accommodationRoomController.getById);
    // router.post("/", accommodationRoomController.create);
    // router.put("/:id", accommodationRoomController.update);
    // router.delete("/:id", accommodationRoomController.delete);

    return router;
  }
}
