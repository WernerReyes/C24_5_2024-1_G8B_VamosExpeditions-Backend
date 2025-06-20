import type { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../core/adapters";

import { EnvsConst, ErrorCodeConst } from "@/core/constants";

import * as cookie from "cookie";
import { Socket } from "socket.io";
import { AuthContext, type AuthUser } from "./auth/auth.context";
import { TimeZoneContext } from "@/core/context";
import { type RoleEnum, UserModel } from "@/infrastructure/models";

export interface RequestAuth extends Request {
  user: AuthUser;
}

export interface RequestAuth2FA extends Request {
  data: {
    userId: number;
    deviceId: string;
  };
}

export class Middleware {
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.url.includes("re-login")
      ? req.cookies[EnvsConst.REFRESH_TOKEN_COOKIE_NAME]
      : req.cookies[EnvsConst.TOKEN_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Token is required",
        code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
      });
    }
    try {
      const payload = await JwtAdapter.verifyToken<{
        id: string;
        deviceId: string;
      }>(token);

      if (!payload) {
        return res.status(401).json({
          ok: false,
          message: "Invalid token",
          code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
        });
      }

      let user = AuthContext.isInitialized
        ? await AuthContext.getAuthenticatedUser(
            parseInt(payload.id),
            payload.deviceId
          )
        : await UserModel.findUnique({
            where: { id_user: parseInt(payload.id) },
            select: {
              id_user: true,
              role: { select: { name: true } },
            },
          });

      if (!user) {
        return res.status(401).json({
          ok: false,
          message: "Invalid token",
          code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
        });
      }

      (req as RequestAuth).user = AuthContext.isInitialized
        ? (user as AuthUser)
        : (function () {
            const { id_user, role } = user as UserModel;
            return {
              id: id_user,
              role: role?.name,
            } as AuthUser;
          })();

      next();
    } catch (error) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token",
        code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
      });
    }
  }

  static async validateToken2FA(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.params.token;
    if (!token)
      return res.status(401).json({
        ok: false,
        message: "Token is required",
        code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
      });
    try {
      const payload = await JwtAdapter.verifyToken<{
        id: string;
        deviceId: string;
      }>(token);

      if (!payload) {
        return res.status(401).json({
          ok: false,
          message: "Invalid token",
          code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
        });
      }

      (req as RequestAuth2FA).data = {
        userId: +payload.id,
        deviceId: payload.deviceId,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token",
        code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
      });
    }
  }

  static validateActionPermission(roles: RoleEnum[]) {
    return (req: RequestAuth, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role as RoleEnum)) {
        return res.status(403).json({
          ok: false,
          message: "Unauthorized",
          code: ErrorCodeConst.ERR_USER_UNAUTHORIZED,
        });
      }
      next();
    };
  }

  static validateOwnership(
    req: RequestAuth,
    res: Response,
    next: NextFunction
  ) {
    {
      if (req.user.id !== parseInt(req.params.userId)) {
        return res.status(403).json({
          ok: false,
          message: "Unauthorized",
          code: ErrorCodeConst.ERR_USER_UNAUTHORIZED,
        });
      }
      next();
    }
  }

  public static async validateSocketToken(
    socket: Socket,
    next: (err?: any) => void
  ) {
    try {
      // TODO: Check the bevehaior of the socket handshake
      const cookies = socket.handshake.headers.cookie;
      const token = 
         socket.handshake.auth.token ?? cookie.parse(cookies!)[EnvsConst.TOKEN_COOKIE_NAME]
        
      if (!token) return next(new Error("Token is required"));

      const payload = await JwtAdapter.verifyToken<{
        id: string;
        deviceId: string;
      }>(token);
      if (!payload) return next(new Error("Invalid token"));

      socket.data = { id: payload.id, deviceId: payload.deviceId };
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  }

  public static timeZoneContextMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const tz = req.headers[EnvsConst.TIME_ZONE_NAME]?.toString() ?? "UTC";
    TimeZoneContext.getInstance().run({ timeZone: tz }, () => {
      next();
    });
  };
}
