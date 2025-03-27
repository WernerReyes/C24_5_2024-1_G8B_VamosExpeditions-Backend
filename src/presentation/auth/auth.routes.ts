import { Router } from "express";
import { Middleware, type RequestAuth } from "../middleware";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authService = new AuthService();
    const authController = new AuthController(authService);

    router.post("/login", authController.login);
    router.post("/re-login", Middleware.validateToken, (req, res) =>
      authController.reLogin(req as RequestAuth, res)
    );
    router.post("/logout", authController.logout);
    router.get("/user-authenticated", Middleware.validateToken, (req, res) =>
      authController.userAuthenticated(req as RequestAuth, res)
    );
    // router.post("/register", AuthController.register);

    return router;
  }
}
