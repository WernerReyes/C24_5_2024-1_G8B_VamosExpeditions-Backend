import { Router } from "express";
import { Middleware } from "../middleware";
import { HotelController } from "./hotel.controller";
import { HotelService } from "./hotel.service";
import { HotelMapper } from "./hotel.mapper";

export class HotelRoutes {
  static get routes(): Router {
    const router = Router();

    const hotelMapper = new HotelMapper();
    const hotelService = new HotelService(hotelMapper);
    const hotelController = new HotelController(hotelService);

    router.use(Middleware.validateToken);

    router.get("/", hotelController.getAll);
    // router.get("/search/:country/:city", hotelController.countryAndCity);
    // router.get("/:id", HotelController.getById);
    // router.post("/", HotelController.create);
    // router.put("/:id", HotelController.update);
    // router.delete("/:id", HotelController.delete);

    return router;
  }
}
