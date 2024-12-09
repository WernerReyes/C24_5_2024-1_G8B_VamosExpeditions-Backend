import type { Request, Response } from "express";
import { AppController } from "../controller";
import { AuthService } from "../services/auth/auth.service";
import { EnvsConst } from "@/core/constants";
import { LoginDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class AuthController extends AppController {
  private TOKEN_COOKIE_NAME = "token";

  constructor(private readonly authService: AuthService) {
    super();
  }
  private setCookie = (res: Response, token: string) => {
    res.cookie(this.TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      // secure: EnvsConst.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * EnvsConst.COOKIE_EXPIRATION), // 1 day
      // sameSite: "none",
      path: "/",
    });
  };

  public login = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);
    if (error) return this.handleError(res, CustomError.badRequest(error));

    await this.authService
      .login(loginDto!)
      .then((response) => {
        this.setCookie(res, response.data.token);
        return res.status(200).json({
          message: response.message,
          status: response.status,
          data: {
            user: response.data.user,
          },
        });
      })
      .catch((error) => this.handleError(res, error));
      
  };

  public logout = async (req: Request, res: Response) => {
    res.clearCookie(this.TOKEN_COOKIE_NAME);
    this.authService
      .logout()
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleError(res, error));
  };

  public userAuthenticated = async (req: Request, res: Response) => {
    return res.status(200).json({
      message: "Usuario autenticado correctamente",
      status: 200,
      data: {
        user: req.body.user,
      },
    });
  };
}
