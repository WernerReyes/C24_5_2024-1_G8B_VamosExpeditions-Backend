import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { HotelRoutes } from "./hotel/hotel.routes";
import { ClientRoutes } from "./client/client.routes";
import { ReservationRoutes } from "./reservation/reservation.routes";
import { ExternalCountryRoutes } from "./external/country/country.routes";
import { CountryRoutes } from "./country/country.routes";
import { QuotationRoutes } from "./quotation/quotation.routes";
import { VersionQuotationRoutes } from "./versionQuotation/versionQuotation.routes";
import { HotelRoomQuotationRoutes } from "./hotelRoomQuotation/hotelRoomQuotation.routes";

export class AppRoutes {
  private static prefix: string = "/api/v1";

  static get routes(): Router {
    const router = Router();

    router.use(`${this.prefix}/auth`, AuthRoutes.routes);
    router.use(`${this.prefix}/country`, CountryRoutes.routes);
    router.use(`${this.prefix}/hotel`, HotelRoutes.routes);
    router.use(`${this.prefix}/client`, ClientRoutes.routes);
    router.use(`${this.prefix}/reservation`, ReservationRoutes.routes);
    router.use(`${this.prefix}/quotation`, QuotationRoutes.routes);
    router.use(
      `${this.prefix}/version-quotation`,
      VersionQuotationRoutes.routes
    );
    router.use(
      `${this.prefix}/hotel-room-quotation`,
      HotelRoomQuotationRoutes.getRoutes
    );

    //* External
    router.use(`${this.prefix}/external/country`, ExternalCountryRoutes.routes);

    return router;
  }
}
