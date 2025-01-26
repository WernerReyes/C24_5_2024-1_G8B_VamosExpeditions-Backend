import type { NextFunction, Request, Response } from "express";
import { UserModel } from "@/data/postgres";
import { JwtAdapter } from "@/core/adapters";
import { UserEntity } from "@/domain/entities";
import { ErrorCodeConst } from "@/core/constants";

export class Middleware {
  static async validateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.cookies.token;
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
      req.body.user = userEntity;
      next();
    } catch (error) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token",
        code: ErrorCodeConst.ERR_USER_INVALID_TOKEN,
      });
    }
  }
}
