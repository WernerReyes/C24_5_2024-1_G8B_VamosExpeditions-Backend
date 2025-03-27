import { Router } from "express";
import { Middleware } from "../middleware";
import { TripDetailsController } from "./tripDetails.controller";
import { TripDetailsService } from "./tripDetails.service";
import { TripDetailsMapper } from "./tripDetails.mapper";
import { PdfService } from "@/lib";
import { HotelReportPDF } from "@/report/pdf-reports/report.hotel.pdf";

export class TripDetailsRoutes {
  static get routes(): Router {
    const router = Router();

    const pdfService = new PdfService();
    const tripDetailsMapper = new TripDetailsMapper();
    const hotelReportPDF=  new HotelReportPDF();
    const tripDetailsService = new TripDetailsService(
      tripDetailsMapper,
      pdfService,
      hotelReportPDF

    );
    const tripDetailsController = new TripDetailsController(tripDetailsService);

    router.use(Middleware.validateToken);

    router.post("", tripDetailsController.upsertTripDetails);
    router.put("/:id", tripDetailsController.upsertTripDetails);
    
    // router.get("/:id", tripDetailsController.getTripDetailsById);
    router.get("/version-quotation",tripDetailsController.getTripDetailsByVersionQuotationId);
    router.get("/pdf/:id", tripDetailsController.getTripDetailsPdf);
    router.get("/report/:id", tripDetailsController.getAllTripDetailsPdf);
    return router;
  }
}
