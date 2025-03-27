import type { NextFunction, Request, Response } from "express";
import { UserModel } from "@/data/postgres";
import { JwtAdapter } from "@/core/adapters";

import { RoleEnum, UserEntity } from "@/domain/entities";
import { EnvsConst, ErrorCodeConst } from "@/core/constants";

import { Socket } from "socket.io";
import * as cookie from "cookie";

export interface RequestAuth extends Request {
  user: UserEntity;
}

export class Middleware {
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    const token =
      req.cookies[EnvsConst.TOKEN_COOKIE_NAME] ?? req.url.includes("re-login")
        ? req.cookies[EnvsConst.REFRESH_TOKEN_COOKIE_NAME]
        : null;
    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Token is required",
        code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
      });
    }
    try {
      const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
      const user = await UserModel.findFirst({
        where: {
          id_user: parseInt(payload!.id),
        },
        include: {
          role: true,
        },
      });
      if (!user) {
        return res.status(401).json({
          ok: false,
          message: "Invalid token",
          code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
        });
      }
      const userEntity = UserEntity.fromObject(user);
      (req as RequestAuth).user = userEntity;
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
      if (!roles.includes(req.user.role!.name as RoleEnum)) {
        return res.status(403).json({
          ok: false,
          message: "Unauthorized",
          code: ErrorCodeConst.ERR_USER_UNAUTHORIZED,
        });
      }
      next();
    };
  }

  static validateOwnership() {
    return (req: RequestAuth, res: Response, next: NextFunction) => {
      if (req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({
          ok: false,
          message: "Unauthorized",
          code: ErrorCodeConst.ERR_USER_UNAUTHORIZED,
        });
      }
      next();
    };
  }

  public static async validateSocketToken(
    socket: Socket,
    next: (err?: any) => void
  ) {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error("Token no proporcionado"));

      const token = cookie.parse(cookies).token;
      if (!token) return next(new Error("Token is required"));

      const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
      if (!payload) return next(new Error("Invalid token"));

      socket.data = { id: payload.id };
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  }
}
