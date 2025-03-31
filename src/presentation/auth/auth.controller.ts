import type { Request, Response } from "express";
import { AppController } from "../controller";
import { EnvsConst } from "@/core/constants";
import { LoginDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { AuthService } from "./auth.service";
import type { RequestAuth } from "../middleware";

export class AuthController extends AppController {
  constructor(private readonly authService: AuthService) {
    super();
  }
  private setCookie = (res: Response, token: string) => {
    const expires = 1000 * 60 * 60 * 24 * EnvsConst.COOKIE_EXPIRATION;
    const expiresAt = new Date(
      Date.now() + expires
      // Date.now() + 1000 * 60 * EnvsConst.COOKIE_EXPIRATION
    ); //* 24 hours

    const expiresAtRefresh = new Date(
      Date.now() + expires + 1000 * 60 //* 1 minute
    );

    console.log(EnvsConst.TOKEN_COOKIE_NAME);
    console.log(EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME);
    console.log(EnvsConst.REFRESH_TOKEN_COOKIE_NAME);

    res.cookie(EnvsConst.TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: EnvsConst.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "none",
      path: "/",
    });

    //* Set an additional non-HTTP-only cookie for expiration time
    res.cookie(
      EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME,
      expiresAt.toISOString(),
      {
        httpOnly: false, // Allow client-side access
        secure: false,
        expires: expiresAt,
        path: "/",
      }
    );

    res.cookie(EnvsConst.REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: EnvsConst.NODE_ENV === "production",
      expires: expiresAtRefresh,
      // sameSite: "none",
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

  public reLogin = async (req: RequestAuth, res: Response) => {
    this.handleError(this.authService.reLogin(req.user))
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

  public logout = async (req: Request, res: Response) => {
    res.clearCookie(EnvsConst.TOKEN_COOKIE_NAME);
    res.clearCookie(EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME);
    res.clearCookie(EnvsConst.REFRESH_TOKEN_COOKIE_NAME);
    this.authService
      .logout()
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleResponseError(res, error));
  };

  public userAuthenticated = async (req: RequestAuth, res: Response) => {
    const expiresAt = req.cookies[EnvsConst.EXPIRATION_TOKEN_COOKIE_NAME];
    return res.status(200).json({
      message: "Usuario autenticado correctamente",
      status: 200,
      data: {
        user: req.user,
        expiresAt,
      },
    });
  };
}
