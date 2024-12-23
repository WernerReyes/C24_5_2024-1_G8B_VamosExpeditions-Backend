import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { AccommodationRoomRoutes } from "./accommodationRoom/accommodationRoom.routes";
import { ClientRoutes } from "./client/client.routes";
import { ReservationRoutes } from "./reservation/reservation.routes";
import { ExternalCountryRoutes } from "./external/country/country.routes";
import { NationRoutes } from "./nation/nation.routes";

export class AppRoutes {
  private static prefix: string = "/api/v1";

  static get routes(): Router {
    const router = Router();

    router.use(`${this.prefix}/auth`, AuthRoutes.routes);

    router.use(
      `${this.prefix}/accommodation-room`,
      AccommodationRoomRoutes.routes
    );
    router.use(`${this.prefix}/client`, ClientRoutes.routes);
    router.use(`${this.prefix}/reservation`, ReservationRoutes.routes);
    router.use(`${this.prefix}/nation`, NationRoutes.routes);

    //* External
    router.use(`${this.prefix}/external/country`, ExternalCountryRoutes.routes);

    return router;
  }
}
