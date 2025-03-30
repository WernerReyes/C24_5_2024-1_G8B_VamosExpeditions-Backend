import { Router } from "express";
import { HotelRoomTripDetailsController } from "./hotelRoomTripDetails.controller";
import { HotelRoomTripDetailsService } from "./hotelRoomTripDetails.service";
import { HotelRoomTripDetailsMapper } from "./hotelRoomTripDetails.mapper";
import { Middleware } from "../middleware";

export class HotelRoomTripDetailsRoutes {
  public static get getRoutes(): Router {
    const router = Router();

    const hotelRoomTripDetailsMapper = new HotelRoomTripDetailsMapper();
    const hotelRoomTripDetailsService = new HotelRoomTripDetailsService(
      hotelRoomTripDetailsMapper,
    );
    const hotelRoomTripDetailsController = new HotelRoomTripDetailsController(
      hotelRoomTripDetailsService
    );

    router.use(Middleware.validateToken);

    router.get("/", hotelRoomTripDetailsController.getHotelRoomTripDetails);
    router.post("/", hotelRoomTripDetailsController.createHotelRoomTripDetails);
    router.post(
      "/many",
      hotelRoomTripDetailsController.insertManyHotelRoomTripDetails
    );

    router.put(
      "/many/date",
      hotelRoomTripDetailsController.updateHotelRoomTripDetailsByDate
    );

    router.delete(
      "/:id",
      hotelRoomTripDetailsController.deleteHotelRoomTripDetails
    );

    router.delete(
      "/many/date",
      hotelRoomTripDetailsController.deleteManyHotelRoomTripDetails
    );

    return router;
  }
}
