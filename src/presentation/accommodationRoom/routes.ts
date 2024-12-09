import { Router } from "express";
import {
  AccommodationRoomResponse,
  AccommodationRoomService,
} from "../services/accommodationRoom";
import { AccommodationRoomController } from "./controller";
import { Middleware } from "../middleware";

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
