import { Router } from "express";
import { AuthRoutes } from "./auth/routes";

import { AccommodationRoomRoutes } from "./accommodationRoom/routes";

import { ClientRoutes } from "./client/routes";
import { ReservationRoutes } from "./reservation/routes";

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

    return router;
  }
}
