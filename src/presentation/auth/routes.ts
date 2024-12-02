import { Router } from "express";
import { AuthService, AuthResponse } from "../services/auth";
import { AuthController } from "./controller";
import { Middleware } from "../middleware";
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authResponse = new AuthResponse();
    const authService = new AuthService(authResponse);
    const authController = new AuthController(authService);

    router.post("/login", authController.login);
    router.post("/logout", authController.logout);
    router.get(
      "/user-authenticated",
      Middleware.validateToken,
      authController.userAuthenticated
    );
    // router.post("/register", AuthController.register);

    return router;
  }
}
