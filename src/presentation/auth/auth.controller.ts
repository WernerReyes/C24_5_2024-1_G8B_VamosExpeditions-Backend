import type { Request, Response } from "express";
import { AppController } from "../controller";
import { EnvsConst } from "@/core/constants";
import { LoginDto, ResetPasswordDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { AuthService } from "./auth.service";
import type { RequestAuth } from "../middleware";
import { Validations } from "@/core/utils";

export class AuthController extends AppController {
  constructor(private readonly authService: AuthService) {
    super();
  }
  private setCookie = (res: Response, token: string) => {
    const expires = 1000 * 60 * 60 * 24 * EnvsConst.COOKIE_EXPIRATION; //* 24 hours
    const expiresAt = new Date(
      Date.now() + expires
    ); //* 24 hours

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

  public login = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.authService.login(loginDto!))
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

  public sendResetPasswordEmail = async (req: Request, res: Response) => {
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

  public resetPassword = async (req: Request, res: Response) => {
    const [error, resetPasswordDto] = ResetPasswordDto.create(req.body);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.authService.resetPassword(resetPasswordDto!))
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public reLogin = async (req: RequestAuth, res: Response) => {
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

  public logout = async (req: RequestAuth, res: Response) => {
    res.clearCookie(EnvsConst.TOKEN_COOKIE_NAME);
    res.clearCookie(EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME);
    res.clearCookie(EnvsConst.REFRESH_TOKEN_COOKIE_NAME);
    this.authService
      .logout(req.user.id)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public userAuthenticated = async (req: RequestAuth, res: Response) => {
    const expiresAt = req.cookies[EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME];
    this.handleError(this.authService.userAuthenticated(req.user.id))
      .then((response) => {
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

    // return res.status(200).json({
    //   message: "Usuario autenticado correctamente",
    //   status: 200,
    //   data: {
    //     user: req.user,
    //     expiresAt,
    //   },
    // });
  };
}
