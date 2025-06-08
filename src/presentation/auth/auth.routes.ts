import { Router } from "express";
import { Middleware, RequestAuth2FA, type RequestAuth } from "../middleware";
import { AuthController } from "./auth.controller";
import { AuthMailer } from "./auth.mailer";
import { AuthService } from "./auth.service";
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authMailer = new AuthMailer();

    const authService = new AuthService(authMailer);
    const authController = new AuthController(authService);

    router.post("/login", authController.login);
    router.post(
      "/send-reset-password-email",
      authController.sendResetPasswordEmail
    );

    router.get(
      "/verify-reset-password-token/:token",
      authController.verifyResetPasswordToken
    );

    router.post("/reset-password", authController.resetPassword);

    router.post("/re-login", Middleware.validateToken, (req, res) =>
      authController.reLogin(req as RequestAuth, res)
    );

    router.get(
      "/generate-two-factor-authentication-secret/:token",
      Middleware.validateToken2FA,
      (req, res) =>
        authController.generateTwoFactorAuthenticationSecret(
          req as RequestAuth2FA,
          res
        )
    );

    router.post(
      "/verify-two-factor-authentication",
      authController.verifyTwoFactorAuthentication
    );

    router.post(
      "/send-email-to-verify-2fa/:token",
      Middleware.validateToken2FA,
      (req, res) =>
        authController.sendEmailToVerify2FA(req as RequestAuth2FA, res)
    );

    router.get("/verify-2fa/:token", Middleware.validateToken2FA, (req, res) =>
      authController.verify2FAEmail(req as RequestAuth2FA, res)
    );

    router.post(
      "/set-token-from-2fa-email/:token",
      Middleware.validateToken2FA,
      (req, res) =>
        authController.setCookieFrom2FAEmail(req as RequestAuth2FA, res)
    );

    router.post("/disconnect-device", Middleware.validateToken, (req, res) =>
      authController.disconnectDevice(req as RequestAuth, res)
    );

    router.post("/logout", Middleware.validateToken, (req, res) =>
      authController.logout(req as RequestAuth, res)
    );
    router.get("/user-authenticated", Middleware.validateToken, (req, res) =>
      authController.userAuthenticated(req as RequestAuth, res)
    );
    // router.post("/register", AuthController.register);

    return router;
  }
}
