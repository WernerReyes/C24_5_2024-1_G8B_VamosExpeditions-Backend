import { Router } from "express";
import { HotelRoomQuotationController } from "./hotelRoomQuotation.controller";
import { HotelRoomQuotationService } from "./hotelRoomQuotation.service";
import { HotelRoomQuotationMapper } from "./hotelRoomQuotation.mapper";
import { HotelRoomQuotationResponse } from "./hotelRoomQuotation.response";
import { Middleware } from "../middleware";

export class HotelRoomQuotationRoutes {
  public static get getRoutes(): Router {
    const router = Router();

    const hotelRoomQuotationMapper = new HotelRoomQuotationMapper();
    const hotelRoomQuotationResponse = new HotelRoomQuotationResponse();
    const hotelRoomQuotationService = new HotelRoomQuotationService(
      hotelRoomQuotationMapper,
      hotelRoomQuotationResponse
    );
    const hotelRoomQuotationController = new HotelRoomQuotationController(
      hotelRoomQuotationService
    );

    router.use(Middleware.validateToken);

    router.get("/", hotelRoomQuotationController.getHotelRoomQuotations);
    router.post("/", hotelRoomQuotationController.createHotelRoomQuotation);
    router.post(
      "/many",
      hotelRoomQuotationController.insertManyHotelRoomQuotations
    );
    router.delete(
      "/:id",
      hotelRoomQuotationController.deleteHotelRoomQuotation
    );

    return router;
  }
}
