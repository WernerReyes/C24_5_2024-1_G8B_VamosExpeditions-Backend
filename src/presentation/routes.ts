import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { UserRoutes } from "./user/user.routes";
import { HotelRoutes } from "./hotel/hotel.routes";
import { ClientRoutes } from "./client/client.routes";
import { ReservationRoutes } from "./reservation/reservation.routes";
import { ExternalCountryRoutes } from "./external/country/country.routes";
import { CountryRoutes } from "./country/country.routes";
import { QuotationRoutes } from "./quotation/quotation.routes";
import { VersionQuotationRoutes } from "./versionQuotation/versionQuotation.routes";
import { HotelRoomTripDetailsRoutes } from "./hotelRoomTripDetails/hotelRoomTripDetails.routes";
import { TripDetailsRoutes } from "./tripDetails/tripDetails.routes";
import { NotificationRoutes } from "./notification/notification.routes";
import { DistritRoutes } from "./distrit/distrit.routes";
import { RoleRoutes } from "./role/role.routes";
import { CityRoutes } from "./city/city.routes";
import { RoomRoutes } from "./room/room.routes";
import { SettingRoutes } from "./setting/setting.routes";

import { Middleware } from "./middleware";
import { ServiceRoutes } from "./service/service.routes";
import { ServiceTypeRoutes } from "./serviceType/serviceType.routes";
import { ServiceTripDetailsRoutes } from "./serviceTripDetails/serviceTripDetails.routes";
import { PartnerRoutes } from "./partner/partner.routes";

export class AppRoutes {
  private static prefix: string = "/api/v1";

  static get routes(): Router {
    const router = Router();

    router.use(Middleware.timeZoneContextMiddleware); // TimeZone

    router.use(`${this.prefix}/auth`, AuthRoutes.routes);
    router.use(`${this.prefix}/role`, RoleRoutes.routes);
    router.use(`${this.prefix}/user`, UserRoutes.routes);
    router.use(`${this.prefix}/notification`, NotificationRoutes.routes);

    //! start room and hotel
    router.use(`${this.prefix}/hotel`, HotelRoutes.routes);
    router.use(`${this.prefix}/room`, RoomRoutes.routes);

    router.use(`${this.prefix}/service`, ServiceRoutes.routes);

    router.use(`${this.prefix}/service-type`, ServiceTypeRoutes.routes);
    //! end room and hotel

    router.use(`${this.prefix}/client`, ClientRoutes.routes);
    router.use(`${this.prefix}/quotation`, QuotationRoutes.routes);
    router.use(
      `${this.prefix}/version-quotation`,
      VersionQuotationRoutes.routes
    );
    router.use(`${this.prefix}/trip-details`, TripDetailsRoutes.routes);
    router.use(
      `${this.prefix}/hotel-room-trip-details`,
      HotelRoomTripDetailsRoutes.routes
    );
    
    router.use(
      `${this.prefix}/service-trip-details`,
      ServiceTripDetailsRoutes.routes
    )

    router.use(`${this.prefix}/reservation`, ReservationRoutes.routes);

    //! start partner
    router.use(`${this.prefix}/partner`, PartnerRoutes.routes);

    //! start     country-city-distrit
    router.use(`${this.prefix}/country`, CountryRoutes.routes);
    router.use(`${this.prefix}/distrit`, DistritRoutes.routes);
    router.use(`${this.prefix}/city`, CityRoutes.routes);

    router.use(`${this.prefix}/setting`, SettingRoutes.routes);
    // end  country-city-distrit

    //* External
    router.use(`${this.prefix}/external/country`, ExternalCountryRoutes.routes);

    return router;
  }
}
