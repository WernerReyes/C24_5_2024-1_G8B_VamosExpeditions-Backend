import { EnvsConst } from "@/core/constants";
import { Validations } from "@/core/utils";
import {
  DisconnectDeviceDto,
  LoginDto,
  ResetPasswordDto,
  Verify2FAAndAuthenticateUserDto,
  Verify2FAEmailAndAuthenticateUserDto,
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import type { Request, Response } from "express";
import { AppController } from "../controller";
import type { RequestAuth, RequestAuth2FA } from "../middleware";
import { AuthService } from "./auth.service";

export class AuthController extends AppController {
  constructor(private readonly authService: AuthService) {
    super();
  }
  private setCookie = (res: Response, token: string) => {
    const expires = EnvsConst.COOKIE_EXPIRATION; //* 24 hours
    const expiresAt = new Date(Date.now() + expires); //* 24 hours

    const expiresAtRefresh = new Date(
      Date.now() + expires + 1000 * 60 //* 1 minute
    );

    res.cookie(EnvsConst.TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: EnvsConst.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: EnvsConst.NODE_ENV === "production" ? "none" : undefined,
      path: "/",
    });

    //* Set an additional non-HTTP-only cookie for expiration time
    res.cookie(
      EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME,
      expiresAt.toISOString(),
      {
        httpOnly: false, // Allow client-side access
        secure: EnvsConst.NODE_ENV === "production", // Change from false
        expires: expiresAt,
        sameSite: EnvsConst.NODE_ENV === "production" ? "none" : undefined,
        path: "/",
      }
    );

    res.cookie(EnvsConst.REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: EnvsConst.NODE_ENV === "production",
      expires: expiresAtRefresh,
      sameSite: EnvsConst.NODE_ENV === "production" ? "none" : undefined,
      path: "/",
    });

    return {
      expiresAt: expiresAt.toISOString(),
    };
  };

  public login = (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create({
      ...req.body,
      userAgent: req.headers["user-agent"],
      browserName: req.headers["browser-name"],
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.authService.login(loginDto!))
      .then((response) => {
        if ("require2FA" in response.data) {
          return res.status(200).json(response);
        }

        const { expiresAt } = this.setCookie(res, response.data.token);

        return res.status(200).json({
          message: response.message,
          status: response.status,
          data: {
            user: response.data.user,
            expiresAt,
            deviceId: response.data.deviceId,
          },
        });
      })
      .catch((error) => this.handleResponseError(res, error));
  };

  public sendResetPasswordEmail = (req: Request, res: Response) => {
    const { email } = req.body;
    const emailError = Validations.validateEmail(email);
    if (emailError)
      return this.handleResponseError(res, CustomError.badRequest(emailError));

    this.handleError(this.authService.sendResetPasswordEmail(email))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public verifyResetPasswordToken = (req: Request, res: Response) => {
    const { token } = req.params;
    const error = Validations.validateStringFields({ token });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.authService.verifyResetPasswordToken(token))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public resetPassword = (req: Request, res: Response) => {
    const [error, resetPasswordDto] = ResetPasswordDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.authService.resetPassword(resetPasswordDto!))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public reLogin = (req: RequestAuth, res: Response) => {
    this.handleError(this.authService.reLogin(req.user.id))
      .then((response) => {
        const { expiresAt } = this.setCookie(res, response.data.token);

        return res.status(200).json({
          message: response.message,
          status: response.status,
          data: {
            user: response.data.user,
            expiresAt,
          },
        });
      })
      .catch((error) => this.handleResponseError(res, error));
  };

  public generateTwoFactorAuthenticationSecret = (
    req: RequestAuth2FA,
    res: Response
  ) => {
    this.handleError(
      this.authService.generateTwoFactorAuthenticationSecret(req.data.userId)
    )
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public verifyTwoFactorAuthentication = (req: Request, res: Response) => {
    const [error, verify2FAAndAuthenticateUserDto] =
      Verify2FAAndAuthenticateUserDto.create({
        ...req.body,
        browserName: req.headers["browser-name"],
        userAgent: req.headers["user-agent"],
      });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(
      this.authService.verify2FAAndAuthenticateUser(
        verify2FAAndAuthenticateUserDto!
      )
    )
      .then((response) => {
        const { expiresAt } = this.setCookie(res, response.data.token);

        return res.status(200).json({
          message: response.message,
          status: response.status,
          data: {
            user: response.data.user,
            expiresAt,
            deviceId: response.data.deviceId,
          },
        });
      })
      .catch((error) => this.handleResponseError(res, error));
  };

  public sendEmailToVerify2FA = (req: RequestAuth2FA, res: Response) => {
    const token = req.params.token;
    this.handleError(
      this.authService.sendEmailToVerify2FA(token, req.data.userId)
    )
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public verify2FAEmail = (req: RequestAuth2FA, res: Response) => {
    this.handleError(
      this.authService
        .verify2FAEmail(req.data.deviceId)
        .then((response) => res.status(200).json(response))
        .catch((error) => this.handleResponseError(res, error))
    );
  };

  public setCookieFrom2FAEmail = (req: RequestAuth2FA, res: Response) => {
    const [error, verify2FAEmailAndAuthenticateUserDto] =
      Verify2FAEmailAndAuthenticateUserDto.create({
        userId: req.data.userId,
        deviceId: req.data.deviceId,
        userAgent: req.headers["user-agent"],
        browserName: req.headers["browser-name"],
      });

    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(
      this.authService
        .setTokenFrom2FAEmail(verify2FAEmailAndAuthenticateUserDto!)
        .then((response) => {
          const { expiresAt } = this.setCookie(res, response.data.token);
          return res.status(200).json({
            message: response.message,
            status: response.status,
            data: {
              user: response.data.user,
              expiresAt,
              deviceId: response.data.deviceId,
            },
          });
        })
        .catch((error) => this.handleResponseError(res, error))
    );
  };

  public disconnectDevice = (req: RequestAuth, res: Response) => {
    const [error, disconnectDeviceDto] = DisconnectDeviceDto.create({
      ...req.body,
      userId: req.user.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.authService.disconnectDevice(disconnectDeviceDto!))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public logout = (req: RequestAuth, res: Response) => {
    res.clearCookie(EnvsConst.TOKEN_COOKIE_NAME);
    res.clearCookie(EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME);
    res.clearCookie(EnvsConst.REFRESH_TOKEN_COOKIE_NAME);
    this.authService
      .logout(req.user)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public userAuthenticated = (req: RequestAuth, res: Response) => {
    const expiresAt = req.cookies[EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME];
    this.handleError(this.authService.userAuthenticated(req.user.id))
      .then((response) => {
        return res.status(200).json({
          message: response.message,
          status: response.status,
          data: {
            user: response.data.user,
            expiresAt,
            deviceId: req.user.device.id,
          },
        });
      })
      .catch((error) => this.handleResponseError(res, error));
  };
}
