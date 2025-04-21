import fs from "fs";
import path from "path";
import multer from "multer";
import { Router } from "express";
import { Middleware } from "../middleware";
import { HotelController } from "./hotel.controller";
import { HotelService } from "./hotel.service";
import { HotelMapper } from "./hotel.mapper";


// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); 


export class HotelRoutes {
  static get routes(): Router {
    const router = Router();

    const hotelMapper = new HotelMapper();
    const hotelService = new HotelService(hotelMapper);
    const hotelController = new HotelController(hotelService);

    router.use(Middleware.validateToken);

    router.get("/", hotelController.getAll);
    router.post("/upload-excel",upload.single("file"), hotelController.uploadExcel);
    router.get("/hotel-all", hotelController.getAllHotel);
    router.get("/page", hotelController.getAllHotelsRoomsAndDistricts); 
    router.post("/hotel-room", hotelController.registerHotelandRoom);
    router.post("/upload-excel-hotel-room",upload.single("file"), hotelController.uploadExcelHotelRoom);


    // router.get("/search/:country/:city", hotelController.countryAndCity);
    // router.get("/:id", HotelController.getById);
    // router.post("/", HotelController.create);
    // router.put("/:id", HotelController.update);
    // router.delete("/:id", HotelController.delete);

    return router;
  }
}
